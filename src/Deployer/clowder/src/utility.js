const Crypto = require('crypto')
const Path = require('path')

// NOTE: ignores case on Windows
const hashify = s => {
  const hash = Crypto.createHash('md5')
  hash.update(s.toLowerCase())
  return hash.digest('hex')
}

// remove anything but numbers and letters and downcase (used for sortkey)
const stripToAlphaNum = s => {
  return s.replace(/[^a-z0-9+]+/gi, '').toLowerCase()
}

// TODO: revisit this if non-Windows is required
// these args get used with SAP's SQLAnywhere
// React doesn't support Path.win32, no windows-ish normalize and sep
// switch to forward slash to avoid escaping hell, switch back in dbf below
// for GGX, aux = ggx server host
const defineSQLAParams = params => {
  const { aux, repo } = params
  const repon = repo.replace(/\\/g, '/')
  const home = Path.basename(Path.dirname(repon))
  const proj = Path.basename(repon)

  return {
    db_params: {
      uid: 'dba',
      pwd: 'sql',
      dbf: Path.join(repo, 'gxdb.db').replace(/\//g, '\\'),
      dbn: `${proj.replace(/ /g, '_')}-${home.replace(/ /g, '_')}`,
      host: aux,
      server: `GGX_${aux.toUpperCase()}`,
      astart: 'YES'
    },
    home: home,
    port: 2638,
    proj: proj
  }
}

module.exports = {
  hashify: hashify,
  stripToAlphaNum: stripToAlphaNum,
  ggxDBConn: defineSQLAParams
}
