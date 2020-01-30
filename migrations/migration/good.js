module.exports = Sequelize => [
  {
    opt: 'create',
    table: 'good',
    column: {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, comment: '名称' },
      description: { type: Sequelize.TEXT, comment: '描述' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    }
  }
  // {
  //   opt: 'addColumn',
  //   table: 'good',
  //   field: 'userId',
  //   type: {
  //     type: Sequelize.UUID,
  //     onUpdate: 'cascade',
  //     onDelete: 'set null'
  //   },
  //   after: 'id'
  // },
  // {
  //   opt: 'changeColumn',
  //   table: 'good',
  //   field: 'description',
  //   type: {
  //     type: Sequelize.STRING
  //   }
  // },
  // {
  //   opt: 'renameColumn',
  //   table: 'good',
  //   fieldBefore: 'description',
  //   fieldAfter: 'descriptions'
  // },
  // {
  //   opt: 'query',
  //   sql: 'ALTER TABLE good CHANGE name name INT;'
  // }
]
