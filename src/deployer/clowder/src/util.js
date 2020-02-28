const Crypto = require('crypto')

// ignores case on Windows
const hashify = s => {
  //console.log('HASHIFY: ' + s)
  const hash = Crypto.createHash('md5')
  hash.update(s.toLowerCase())
  return hash.digest('hex')
}

exports.hashify = hashify
