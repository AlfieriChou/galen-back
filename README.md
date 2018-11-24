[![Standard - JavaScript Style Guide]( https://cdn.rawgit.com/standard/standard/master/badge.svg )]( https://github.com/standard/standard )

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

* output

  * array

  ```javascript
  output: {
    200: {
      type: 'array',
      result: User.rawAttributes
    }
  }
  ```

  * object
  
  ```javascript
  output: {
    200: {
      type: 'object',
      result: User.rawAttributes
    }
  }
  ```

  * number
  
  ```javascript
  output: {
    200: {
      type: 'number'
    }
  }
  ```

  * string
  
  ```javascript
  output: {
    200: {
      type: 'string'
    }
  }
  ```