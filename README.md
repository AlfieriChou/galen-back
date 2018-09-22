# How to write swagger document in Sequelize model

### model

1. props

  ```javascript
  let props = {
    id: { type: Sequelize.INTEGER, primaryKey: true, comment: 'id' },
    phone: { type: Sequelize.STRING, comment: '手机号' },
    password: { type: Sequelize.STRING, comment: '密码' },
    nickname: { type: Sequelize.STRING, comment: '昵称' }
  }
  ```

2. define sequelize

  ```javascript
  let User = sequelize.define('users', props)
  ```
	
3. index

  ```javascript
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
  }
  ```
	
4. create

  ```javascript
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
  }
  ```

5. update

  ```javascript
  update: {
    path: '/users/:id',
    method: 'put',
    tags: ['user'],
    summary: '更新用户信息',
    params: _.pick(User.rawAttributes, ['id']),
    requestBody: {
      body: _.pick(User.rawAttributes, ['phone', 'password'])
    },
    output: {
      type: 'number'
    }
  }
  ```
