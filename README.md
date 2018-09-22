# How to write swagger document in Sequelize

1. index

  ```javascript
  index: {
    path: '/users',
    method: 'get',
    tags: ['user'],
    summary: 'users list',
    query: Object.assign(
      _.pick(User.rawAttributes, ['nickname']),
      {
        sort: { type: Sequelize.STRING, comment: 'sort eg: created_at -created_at' }
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
    summary: 'create user',
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
    summary: 'update user',
    params: _.pick(User.rawAttributes, ['id']),
    requestBody: {
      body: _.pick(User.rawAttributes, ['phone', 'password'])
    },
    output: {
      type: 'number'
    }
  }
  ```

### swagger

* path
  * Define the interface baseUrl.

* method
  * Interface request method.

* tags
  * Interface tag.

* summary
  * summary is the interface description.

* query
  * if you query a data source using query.

* requestBody
  * requestBody includes body and required.
  * body: Incoming fields
  * required: required field

* params
  * url parameters, usually is id.

### output

* Output Type support three type array object and number. if you not write output, response will output this model attributes.

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
            "description": "response code"
          }
        }
      }
      ```