# route

- dynamic routes
- crud
  - index - get list
  - create - create
  - show - get one by id
  - update - update by id
  - destroy - destroy by id
- support swagger document

example:

```javascript
const _ = require('lodash')
const Sequelize = require('sequelize')
const db = require('../model')

const { Role } = db

module.exports = {
  // schema
  Role,
  // list
  index: {
    path: '/roles',
    method: 'get',
    tags: ['role'],
    summary: '获取权限列表',
    query: {
      where: { type: Sequelize.JSON, comment: '搜索条件 例如：where={}' },
      order: { type: Sequelize.ARRAY, comment: '排序 例如：order=[["createdAt","desc"]]' },
      attribute: { type: Sequelize.ARRAY, comment: '返回字段控制 例如：attribute=["id"]' },
      include: {  type: Sequelize.ARRAY, comment: '关联表 关联查询 例如：include=[{"model":"UserRole"}]' },
      offset: { type: Sequelize.INTEGER, comment: '分页偏移量 例如：offset=0' },
      limit: { type: Sequelize.INTEGER, comment: '分页数量 例如：limit=20' }
    },
    output: {
      200: {
        type: 'object',
        result: {
          count: { type: Sequelize.INTEGER, comment: '总数' },
          offset: { type: Sequelize.INTEGER, comment: '偏移量' },
          limit: { type: Sequelize.INTEGER, comment: '限制数量' },
          datas: { type: Sequelize.ARRAY, items: { type: Sequelize.JSON, keys: Role.rawAttributes }, comment: '数据' }
        }
      }
    }
  },
  // create
  create: {
    path: '/roles',
    method: 'post',
    roles: ['admin'], // api roles
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
  // get one by id
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
  // update by id
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
  // destroy by id
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
```