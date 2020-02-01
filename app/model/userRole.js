// eslint-disable-next-line func-names
module.exports = function (sequelize, DataTypes) {
  const UserRole = sequelize.define('UserRole', {

  }, {
    underscored: true,
    tableName: 'userRole'
  })

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.Role)
    UserRole.belongsTo(models.User)
  }

  return UserRole
}
