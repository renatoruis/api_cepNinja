const redis = require('redis')
const { promisify } = require('util')

let connection

const getCredencialsRedis = () => {
  if (process.env.REDIS_PASS) {
    return {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      auth_pass: process.env.REDIS_PASS,
      tls: true
    }
  }
  return {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
}

const getClient = () => {
  return new Promise((resolve, reject) => {
    if (connection) return resolve(connection)
    this.conn = redis.createClient(getCredencialsRedis())

    this.conn.on('connect', () => {
      connection = this.conn
      return resolve(connection)
    })

    this.conn.on('error', (err) => {
      console.log(`${err.message || err}`)
      return reject(err)
    })
  })
}

module.exports = async (list) => {
  const client = await getClient()

  const set = promisify(client.set).bind(client)

  const total = list.length

  for (const cepIndex in list) {
    const cep = list[cepIndex]
    await set(`${process.env.REDIS_PREFIX}::${cep.cep}`, JSON.stringify(cep))
    if (cepIndex % 1000 === 0) {
      console.log(`${cepIndex}/${total} ${(((100 * cepIndex) / total)).toFixed(2)}%`)
    }
  }
}
