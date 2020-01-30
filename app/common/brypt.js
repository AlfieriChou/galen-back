const Bcrypt = require('bcrypt')
const { promisify } = require('util')

const bcryptHash = promisify(Bcrypt.hash)

const RECOMMENDED_ROUNDS = 12

const verifyPassword = (hash, password) => Bcrypt.compareSync(password, hash)

const isBcryptHash = (str) => {
  const protocol = str.split('$')
  return protocol.length === 4 &&
    protocol[0] === '' &&
    ['2a', '2b', '2y'].indexOf(protocol[1]) > -1 &&
    /^\d+$/.test(protocol[2]) &&
    protocol[3].length === 53
}

const generateHash = async (password = '') => {
  if (isBcryptHash(password)) {
    throw new Error('bcrypt tried to hash another bcrypt hash')
  }
  return bcryptHash(password, RECOMMENDED_ROUNDS)
}

module.exports = {
  verifyPassword,
  generateHash
}
