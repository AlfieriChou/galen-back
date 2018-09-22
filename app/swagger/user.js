const _ = require('lodash')
const Sequelize = require('sequelize')
const db = require('../model')
const User = db.User

module.exports = {
  User,
  index: {
    path: '/users',
    method: 'get',
    tags: ['user'],
    summary: '获取用户列表',
    query: Object.assign(
      _.pick(User.rawAttributes, ['nickname']),
      {
        sort: { type: Sequelize.STRING, comment: '排序 例如：created_at和-created_at' }
      }
    ),
    output: {
      type: 'array',
      result: User.rawAttributes
    }
  },
  create: {
    path: '/users',
    method: 'post',
    tags: ['user'],
    summary: '创建用户',
    requestBody: {
      body: _.pick(User.rawAttributes, ['phone', 'password']),
      required: ['phone', 'password']
    },
    output: {
      type: 'object',
      result: User.rawAttributes
    }
  },
  show: {
    path: '/users/:id',
    method: 'get',
    tags: ['user'],
    summary: '获取用户详情',
    params: _.pick(User.rawAttributes, ['id'])
  },
  update: {
    path: '/users/:id',
    method: 'put',
    tags: ['user'],
    summary: '修改用户信息',
    params: _.pick(User.rawAttributes, ['id']),
    requestBody: {
      body: _.pick(User.rawAttributes, ['phone', 'password'])
    },
    output: {
      type: 'number'
    }
  }
}
