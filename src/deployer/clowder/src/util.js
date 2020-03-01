const Crypto = require('crypto')

// ignores case on Windows
const hashify = s => {
  //console.log('HASHIFY: ' + s)
  const hash = Crypto.createHash('md5')
  hash.update(s.toLowerCase())
  return hash.digest('hex')
}

// remove anything but numbers and letters and downcase (used for sortkey)
const stripToAlphaNum = s => {
  return s.replace(/[^a-z0-9+]+/gi, '').toLowerCase()
}

module.exports = {
  hashify: hashify,
  stripToAlphaNum: stripToAlphaNum
}
