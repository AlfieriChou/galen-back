const Sequelize = require('sequelize')

const model = {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  roleId: { type: Sequelize.INTEGER, comment: '权限id' },
  userId: { type: Sequelize.INTEGER, comment: '用户id' },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
  deletedAt: { type: Sequelize.DATE }
}

module.exports = {
  migrations: {
    createTable: model
  },
  createModel: (sequelize) => {
    const UserRole = sequelize.define('UserRole', model, {
      underscored: true,
      tableName: 'user_role'
    })

    UserRole.associate = (models) => {
      UserRole.belongsTo(models.Role)
      UserRole.belongsTo(models.User)
    }

    return UserRole
  }
}
