## migrations

### createTable

```javascript
{
  createTable: {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  }
}
```

### addColumn

```javascript
{
  addColumn: {
    field: 'description',
    type: { type: Sequelize.TEXT },
    after: 'avator'
  }
}
```

### changeColumn

```javascript
{
  changeColumn: {
    field: 'description',
    type: {
      type: Sequelize.STRING
    }
  }
}
```

### renameColumn

```javascript
{
  renameColumn: {
    before: 'description',
    after: 'descriptions'
  }
}
```

### addIndex

```javascript
{
  addIndex: {
    attributes: ['firstname', 'lastname'],
    options: {
      indexName: 'SuperDuperIndex',
      indicesType: 'UNIQUE'
    }
  }
}
```

### query - 暂时未开放

```javascript
{
  query: {
    sql: 'ALTER TABLE goods CHANGE name name INT;'
  }
}
```