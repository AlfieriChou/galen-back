// eslint-disable-next-line func-names
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    phone: { type: DataTypes.STRING, comment: '手机号' },
    password: { type: DataTypes.STRING, comment: '密码' },
    nickname: { type: DataTypes.STRING, comment: '昵称' }
  })

  return User
}
