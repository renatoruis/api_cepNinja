const express = require('express')
const router = express.Router()
const { promisify } = require('util')
const jsontoxml = require('jsontoxml')

const { getClient, makeKey } = require('../../src/connection/redis')

const midRemoteDash = (req, res, next) => {
  if (req.params.cep && typeof req.params.cep === 'string') {
    req.params.cep = req.params.cep.replace('-', '')
  }
  return next()
}

const getObject = async (cep) => {
  const client = await getClient()

  const get = promisify(client.get).bind(client)

  return JSON.parse(await get(makeKey(cep)))
}

router.get('/ws/:cep/json', midRemoteDash, async (req, res, next) => {
  const cepObject = await getObject(req.params.cep)

  if (!cepObject) {
    return res.status(404).json({
      error: `Cep ${req.params.cep} não encontrado !`
    })
  }

  return res.status(200).json(cepObject)
})

router.get('/ws/:cep/xml', midRemoteDash, async (req, res, next) => {
  const cepObject = await getObject(req.params.cep)

  res.setHeader('Content-Type', 'application/xml')

  if (!cepObject) {
    return res.status(404).end(jsontoxml({
      xmlcep: {
        error: `Cep ${req.params.cep} não encontrado !`
      }
    }))
  }

  return res.status(200).end(jsontoxml({ xmlcep: cepObject }))
})

module.exports = router
