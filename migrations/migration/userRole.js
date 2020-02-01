module.exports = Sequelize => [
  {
    opt: 'create',
    table: 'userRole',
    column: {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      roleId: { type: Sequelize.INTEGER, comment: '权限id' },
      userId: { type: Sequelize.INTEGER, comment: '用户id' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    }
  }
]
