module.exports = (Sequelize) => {
  return [
    {
      opt: 'create',
      table: 'user',
      column: {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
        name: { type: Sequelize.STRING },
        avator: { type: Sequelize.TEXT },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE }
      }
    },
    {
      opt: 'addColumn',
      table: 'user',
      field: 'description',
      type: { type: Sequelize.TEXT },
      after: 'avator'
    },
    {
      opt: 'removeColumn',
      table: 'user',
      field: 'avator'
    }
    // {
    //   opt: 'drop',
    //   table: 'user'
    // }
  ]
}
