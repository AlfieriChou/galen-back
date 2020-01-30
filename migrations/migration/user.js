module.exports = Sequelize => [
  {
    opt: 'create',
    table: 'user',
    column: {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, comment: '名称' },
      phone: { type: Sequelize.STRING, length: 11, comment: '手机号' },
      password: { type: Sequelize.STRING, length: 32, comment: '密码' },
      nickname: { type: Sequelize.STRING, length: 32, comment: '昵称' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    }
  },
  {
    opt: 'addColumn',
    table: 'user',
    field: 'description',
    type: { type: Sequelize.TEXT, comment: '描述' },
    after: 'nickname'
  }
  // {
  //   opt: 'removeColumn',
  //   table: 'user',
  //   field: 'avator'
  // },
  // {
  //   opt: 'drop',
  //   table: 'user'
  // }
]
