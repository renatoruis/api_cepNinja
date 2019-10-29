const express = require('express')
const router = express.Router()
const jsontoxml = require('jsontoxml')

const { search, makeIndex } = require('../../src/connection/elasticsearch')

const midRemoteDash = (req, res, next) => {
  if (req.params.cep && typeof req.params.cep === 'string') {
    req.params.cep = req.params.cep.replace('-', '')
  }
  return next()
}

const getObjectById = async (cep) => {
  const query = {
    match: {
      _id: cep
    }
  }
  const result = await search({
    index: makeIndex(),
    type: 'cep',
    body: {
      query
    }
  })

  return result.hits.hits.map(hit => hit._source)
}

const getObjectQuery = async (querystring, size = 10, page = 1) => {
  page = page === '0' ? 1 : parseInt(page)
  if (!querystring) return []
  const query = {
    query_string: {
      query: querystring
    }
  }
  const result = await search({
    index: makeIndex(),
    type: 'cep',
    body: {
      size: parseInt(size),
      query,
      from: (page - 1) * size
    }
  })

  return {
    pages: Math.ceil(result.hits.total / size),
    data: result.hits.hits.map(hit => hit._source)
  }
}

router.get('/ws/:cep/json', midRemoteDash, async (req, res, next) => {
  const [cepObject] = await getObjectById(req.params.cep)

  if (!cepObject) {
    return res.status(404).json({
      error: `Cep ${req.params.cep} não encontrado !`
    })
  }

  return res.status(200).json(cepObject)
})

router.get('/ws/:cep/xml', midRemoteDash, async (req, res, next) => {
  const [cepObject] = await getObjectById(req.params.cep)

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

router.get('/ws/xml', midRemoteDash, async (req, res, next) => {
  const cepObject = await getObjectQuery(req.query.q, req.query.limit, req.query.page)

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

router.get('/ws/json', midRemoteDash, async (req, res, next) => {
  const cepObject = await getObjectQuery(req.query.q, req.query.limit, req.query.page)

  if (!cepObject) {
    return res.status(404).json({
      error: `Cep ${req.params.cep} não encontrado !`
    })
  }

  return res.status(200).json(cepObject)
})

module.exports = router
