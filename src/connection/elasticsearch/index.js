const elasticsearch = require('elasticsearch')

let connection

const getClient = () => {
  return new Promise((resolve, reject) => {
    if (connection) return resolve(connection)

    connection = new elasticsearch.Client({
      host: `${process.env.ES_HOST}:${process.env.ES_PORT}`,
      requestTimeout: 100 * 1000
    })

    return resolve(connection)
  })
}

const indexBulk = async ({ index, type, list = [], params = {} }) => {
  let clientElastic = await getClient()

  let bulkList = []

  for (let doc of list) {
    let hed = {}
    if (!doc.id) {
      throw new Error(`Id not found`)
    }
    hed._index = index
    hed._type = type
    hed._id = doc.id

    bulkList.push({
      index: hed
    })

    bulkList.push(doc)
  }

  await clientElastic.bulk({
    body: bulkList, ...params
  })
}

const search = async ({ index, type, body = {} }) => {
  let clientElastic = await getClient()
  return clientElastic.search({
    index,
    type,
    body
  })
}

const ping = async () => {
  let clientElastic = await getClient()
  return clientElastic.ping()
}

const makeIndex = (index = 'cep.ninja') => `${process.env.ES_INDEX_PREFIX}.${index}`.toLowerCase()

module.exports = {
  getClient,
  indexBulk,
  search,
  ping,
  makeIndex
}
