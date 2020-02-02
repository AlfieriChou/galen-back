const Sequelize = require('sequelize')

const model = {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, comment: '权限名称' },
  code: { type: Sequelize.STRING, comment: '权限编码' },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
  deletedAt: { type: Sequelize.DATE }
}

module.exports = {
  migrations: {
    createTable: model
  },
  createModel: (sequelize) => {
    const Role = sequelize.define('Role', model, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: 'role'
    })

    return Role
  }

}
