module.exports = (queryInterface, Sequelize) => {
  return [
    async () => {
      const tables = await queryInterface.showAllTables()
      if (tables.indexOf('pet') < 0) {
        return queryInterface.createTable('pet',
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
    }
  ]
}
