### migration

* opt --> create, addColumn, changeColumn, reanmeColumn, removeColumn, drop, addIndex, query
* table --> opt table
* column --> table fields
* field --> field
* type --> field type
* after --> field after
* fieldBefore --> field name before
* fieldAfter --> field name after
* sql --> sql

#### create

```javascript
{
    opt: 'create',
    table: 'goods',
    column: {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
        name: { type: Sequelize.STRING },
        description: { type: Sequelize.TEXT },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE }
    }
}
```

#### addColumn

```javascript
{
    opt: 'addColumn',
    table: 'user',
    field: 'description',
    type: { type: Sequelize.TEXT },
    after: 'avator'
}
```

#### changeColumn

```javascript
{
    opt: 'changeColumn',
    table: 'user',
    field: 'description',
    type: {
        type: Sequelize.STRING
    }
}
```

#### renameColumn

```javascript
{
    opt: 'renameColumn',
    table: 'user',
    fieldBefore: 'description',
    fieldAfter: 'descriptions'
}
```

#### removeColumn

```javascript
{
    opt: 'removeColumn',
    table: 'user',
    field: 'avator'
}
```

#### drop

```javascript
{
    opt: 'drop',
    table: 'user'
}
```

#### addIndex

```javascript
{
    opt: 'addIndex',
    table: 'user',
    attributes: ['firstname', 'lastname'],
    options: {
        indexName: 'SuperDuperIndex',
        indicesType: 'UNIQUE'
    }
}
```

#### query

```javascript
{
    opt: 'query',
    sql: 'ALTER TABLE goods CHANGE name name INT;'
}
```