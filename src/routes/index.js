const express = require('express')
const router = express.Router()
const { promisify } = require('util')

const { getClient, makeKey } = require('../../src/connection/redis')

/* GET home page. */
router.get('/ws/:cep/json', async (req, res, next) => {
  const client = await getClient()

  const get = promisify(client.get).bind(client)

  const cepObject = JSON.parse(await get(makeKey(req.params.cep)))

  if (!cepObject) {
    return res.status(404).json({
      error: `Cep ${req.params.cep} não encontrado !`
    })
  }

  return res.status(200).json(cepObject)
})

module.exports = router
