const app = require('../server')
const should = require('should')
const request = require('supertest')
const describe = require('mocha').describe
const it = require('mocha').it

describe('GET /swagger.json!!!', function () {
  it('respond with json', function () {
    request(app)
      .get('/v1/swagger.json')
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        should(response.body).be.an.Object
      })
  })
})

describe('GET /apidoc!!!', function () {
  it('response html!!', function () {
    request(app)
      .get('/v1/apidoc')
      .set('Accept', 'text/html')
      .expect(200)
      .then(response => {
        should(response.body).be.html
      })
  })
})
