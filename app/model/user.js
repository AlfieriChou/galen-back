const Sequelize = require('sequelize')

const model = {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  phone: { type: Sequelize.STRING, length: 11, comment: '手机号' },
  password: { type: Sequelize.STRING, length: 32, comment: '密码' },
  nickname: { type: Sequelize.STRING, length: 32, comment: '昵称' },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
  deletedAt: { type: Sequelize.DATE }
}

module.exports = {
  migrations: {
    createTable: model
  },
  createModel: (sequelize) => {
    const User = sequelize.define('User', model, {
      underscored: true,
      tableName: 'user'
    })

    User.associate = (models) => {
      User.hasMany(models.UserRole)
      User.belongsToMany(models.Role, {
        through: 'UserRole',
        foreignKey: 'roleId'
      })
    }

    return User
  }
}
