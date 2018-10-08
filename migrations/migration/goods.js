module.exports = (Sequelize) => {
  return [
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
    },
    {
      opt: 'addColumn',
      table: 'goods',
      field: 'user_id',
      type: {
        type: Sequelize.UUID,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      },
      after: 'id'
    },
    {
      opt: 'changeColumn',
      table: 'goods',
      field: 'description',
      type: {
        type: Sequelize.STRING
      }
    },
    {
      opt: 'renameColumn',
      table: 'goods',
      fieldBefore: 'description',
      fieldAfter: 'descriptions'
    },
    {
      opt: 'query',
      sql: 'ALTER TABLE goods CHANGE name name INT;'
    }
  ]
}
