const _ = require('lodash')
const Sequelize = require('sequelize')
const db = require('../model')

const { User } = db

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
      200: {
        type: 'object',
        result: {
          count: { type: Sequelize.INTEGER, comment: '总数' },
          offset: { type: Sequelize.INTEGER, comment: '偏移量' },
          limit: { type: Sequelize.INTEGER, comment: '限制数量' },
          datas: { type: Sequelize.ARRAY, items: { type: Sequelize.JSON, keys: User.rawAttributes }, comment: '数据' }
        }
      }
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
      200: {
        type: 'object',
        result: User.rawAttributes
      }
    }
  },
  show: {
    path: '/users/:id',
    method: 'get',
    tags: ['user'],
    summary: '获取用户详情',
    params: _.pick(User.rawAttributes, ['id']),
    output: {
      200: {
        type: 'object',
        result: User.rawAttributes
      }
    }
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
      200: {
        type: 'array'
      }
    }
  },
  register: {
    path: '/register',
    method: 'post',
    tags: ['user'],
    summary: '用户注册',
    requestBody: {
      body: _.pick(User.rawAttributes, ['phone', 'password']),
      required: ['phone', 'password']
    },
    output: {
      200: {
        type: 'object',
        result: User.rawAttributes
      }
    }
  },
  login: {
    path: '/login',
    method: 'post',
    tags: ['user'],
    summary: '用户登录',
    requestBody: {
      body: _.pick(User.rawAttributes, ['phone', 'password']),
      required: ['phone', 'password']
    },
    output: {
      200: {
        type: 'object',
        result: {
          user: { type: Sequelize.JSON, keys: User.rawAttributes },
          token: { type: Sequelize.STRING }
        }
      }
    }
  }
}
