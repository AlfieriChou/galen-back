### migration

* opt --> create, addColumn, removeColumn, drop
* table --> opt table
* column --> table fields
* field --> field
* type --> field type
* after --> field after

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