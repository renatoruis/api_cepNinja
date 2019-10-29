require('dotenv').config()
const load = require('./load-database')
/**
 * Deprecated
 */
// const redisImporter = require('./import-redis')

const elasticsearchImporter = require('./import-elasticsearch')

load()
  .then(elasticsearchImporter)
  .then(() => {
    console.log('Done!')
  })
