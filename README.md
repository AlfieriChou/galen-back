# How to write swagger document in Sequelize model

### model
	
1. index

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
	
2. create

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

3. update

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

### output

* Output Type support three types, above array object and number. if you not write output, response will output the model schema.

* type

  * array

    * output
      ```javascript
      output: {
          type: 'array',
          result: {
            { id: Sequelize.INTEGER, comment: 'id' }
          }
        }
      ```

    * json
      ```javascript
      {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int32"
            }
          }
        }
      }
      ```
  * object

    * output
      ```javascript
      output: {
          type: 'object',
          result: {
            { id: Sequelize.INTEGER, comment: 'id' }
          }
        }
      ```

    * json
      ```javascript
      {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          }
        }
      }
      ```

  * number

    * output
      ```javascript
      output: {
          type: 'number'
        }
      ```

    * json
      ```javascript
      {
        "type": "object",
        "properties": {
          "result": {
            "type": "number",
            "description": "返回标识"
          }
        }
      }
      ```