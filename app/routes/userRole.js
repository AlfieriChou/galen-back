const _ = require('lodash')
const db = require('../model')

const { UserRole } = db

module.exports = {
  UserRole,
  create: {
    path: '/userRoles',
    method: 'post',
    tags: ['userRole'],
    summary: '创建用户权限绑定关系',
    requestBody: {
      body: _.pick(UserRole.rawAttributes, ['roleId', 'userId']),
      required: ['roleId', 'userId']
    },
    output: {
      200: {
        type: 'object',
        result: UserRole.rawAttributes
      }
    }
  },
  destroy: {
    path: '/userRoles/:id',
    method: 'delete',
    tags: ['userRole'],
    summary: '删除用户权限绑定关系',
    params: _.pick(UserRole.rawAttributes, ['id']),
    output: {
      200: {
        type: 'number'
      }
    }
  }
}
