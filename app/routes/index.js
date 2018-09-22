const express = require('express')
const controller = require('../controller')

const api = express.Router()

api.get('/users', controller.user.index)
api.post('/users', controller.user.create)

api.get('/swagger.json', controller.swagger.doc)
api.get('/apidoc', controller.swagger.index)

module.exports = api
