// eslint-disable-next-line func-names
module.exports = function (sequelize, DataTypes) {
  const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, comment: '权限名称' },
    code: { type: DataTypes.STRING, comment: '权限编码' }
  }, {
    underscored: true,
    tableName: 'role'
  })

  return Role
}
