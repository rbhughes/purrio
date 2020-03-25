//import pcfg from './purr-cfg'
const Crypto = require('crypto')
const Path = require('path')
// require pcfg instead of import due to:
// https://github.com/webpack/webpack/issues/3997
// (just means we need to add the "default")
const pcfg = require('./purr-cfg').default

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

// Why? Enums in GraphQL are capitalized by convention,
// Underscores are verboten in Lambda names,
// GeoGraphix (and other vendors?) have funny capitalization.
// The naming convention is:
//   organization-environment-AbbreviatedApp + "Asset" + asset
// i.e. purrio-dev-AssetGGXWellHeader
const assetLambdaName = (app, asset) => {
  const abbv = {
    GEOGRAPHIX: 'GGX',
    PETRA: 'PET',
    KINGDOM: 'TKS',
    PETREL: 'PTL'
  }

  const a = asset
    .split('_')
    .map(w => {
      return w.toLowerCase().replace(/\w/, c => c.toUpperCase())
    })
    .join('')

  return `${pcfg.purr_org}-${pcfg.purr_env}-Asset${abbv[app]}${a}`
}

const enqueueLambdaName = () => {
  return `${pcfg.purr_org}-${pcfg.purr_env}-Enqueue`
}

const batcherLambdaName = () => {
  return `${pcfg.purr_org}-${pcfg.purr_env}-Batcher`
}

module.exports = {
  hashify: hashify,
  stripToAlphaNum: stripToAlphaNum,
  assetLambdaName: assetLambdaName,
  enqueueLambdaName: enqueueLambdaName,
  batcherLambdaName: batcherLambdaName,
  ggxDBConn: defineSQLAParams
}
