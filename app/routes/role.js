const _ = require('lodash')
const Sequelize = require('sequelize')
const db = require('../model')

const { Role } = db

module.exports = {
  Role,
  index: {
    path: '/roles',
    method: 'get',
    tags: ['role'],
    summary: '获取权限列表',
    query: Object.assign(
      _.pick(Role.rawAttributes, ['name']),
      {
        sort: { type: Sequelize.STRING, comment: '排序 例如：created_at和-created_at' }
      }
    ),
    output: {
      200: {
        type: 'array',
        result: {
          count: { type: Sequelize.INTEGER, comment: '总数' },
          offset: { type: Sequelize.INTEGER, comment: '偏移量' },
          limit: { type: Sequelize.INTEGER, comment: '限制数量' },
          datas: { type: Sequelize.ARRAY, items: { type: Sequelize.JSON, keys: Role.rawAttributes }, comment: '数据' }
        }
      }
    }
  },
  create: {
    path: '/roles',
    method: 'post',
    roles: ['admin'],
    tags: ['role'],
    summary: '创建权限',
    requestBody: {
      body: _.pick(Role.rawAttributes, ['name', 'code']),
      required: ['name', 'code']
    },
    output: {
      200: {
        type: 'object',
        result: Role.rawAttributes
      }
    }
  },
  show: {
    path: '/roles/:id',
    method: 'get',
    roles: ['admin'],
    tags: ['role'],
    summary: '获取权限详情',
    params: _.pick(Role.rawAttributes, ['id']),
    output: {
      200: {
        type: 'object',
        result: Role.rawAttributes
      }
    }
  },
  update: {
    path: '/roles/:id',
    method: 'put',
    roles: ['admin'],
    tags: ['role'],
    summary: '修改权限信息',
    params: _.pick(Role.rawAttributes, ['id']),
    requestBody: {
      body: _.pick(Role.rawAttributes, ['name', 'code'])
    },
    output: {
      200: {
        type: 'array'
      }
    }
  },
  destroy: {
    path: '/roles/:id',
    method: 'delete',
    roles: ['admin'],
    tags: ['role'],
    summary: '删除权限',
    params: _.pick(Role.rawAttributes, ['id']),
    output: {
      200: {
        type: 'number'
      }
    }
  }
}
