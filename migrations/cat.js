module.exports = (queryInterface, Sequelize) => {
  return [
    async () => {
      const tables = await queryInterface.showAllTables()
      if (tables.indexOf('cat') < 0) {
        return queryInterface.createTable('cat',
          {
            id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
            name: { type: Sequelize.STRING },
            description: { type: Sequelize.TEXT },
            created_at: { type: Sequelize.DATE, allowNull: false },
            updated_at: { type: Sequelize.DATE, allowNull: false },
            deleted_at: { type: Sequelize.DATE }
          }
        )
      }
    },
    async () => {
      const describe = await queryInterface.describeTable('cat')
      if (!describe.weight) {
        return queryInterface.addColumn('cat', 'weight', Sequelize.FLOAT)
      }
    }
  ]
}
