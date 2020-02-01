module.exports = Sequelize => [
  {
    opt: 'create',
    table: 'role',
    column: {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, comment: '名称' },
      code: { type: Sequelize.STRING, comment: '编码' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    }
  }
]
