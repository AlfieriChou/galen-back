const should = require('should')
const request = require('supertest')
const { describe } = require('mocha')
const { it } = require('mocha')
const app = require('../server')

describe('GET /swagger.json!!!', () => {
  it('respond with json', () => {
    request(app)
      .get('/v1/swagger.json')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        // eslint-disable-next-line no-unused-expressions
        should(response.body).be.an.Object
      })
  })
})

describe('GET /apidoc!!!', () => {
  it('response html!!', () => {
    request(app)
      .get('/v1/apidoc')
      .set('Accept', 'text/html')
      .expect(200)
      .then((response) => {
        // eslint-disable-next-line no-unused-expressions
        should(response.body).be.html
      })
  })
})
