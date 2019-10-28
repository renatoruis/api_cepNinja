require('dotenv').config()
const load = require('./load-database')
const redisImporter = require('./import-redis')

load()
  .then(redisImporter)
  .then(() => {
    console.log('Done!')
  })
