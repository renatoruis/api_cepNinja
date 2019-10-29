const redis = require('redis')

let connection

/**
 * Deprecated
 */

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

const makeKey = cep => `${process.env.REDIS_PREFIX}::${cep}`

module.exports = {
  getClient,
  makeKey
}
