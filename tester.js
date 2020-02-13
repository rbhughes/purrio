const util = require('util')
data = [
  {
    id: 'GEOGRAPHIX--(repo path)--Blue',
    rk: 'PRODUCTION_/filterA/',
    app: 'GEOGRAPHIX',
    asset: 'PRODUCTION',
    label: 'Blue',
    filter: '/filterA/',
    repo: '\\\\server\\share\\place\\longname'
  },
  {
    id: 'GEOGRAPHIX--(repo path)--Red',
    rk: 'PRODUCTION_/filterB/',
    app: 'GEOGRAPHIX',
    asset: 'PRODUCTION',
    label: 'Red',
    filter: '/filterB/',
    repo: '\\\\server\\share\\place\\longname'
  },
  {
    id: 'GEOGRAPHIX--(repo path)--Blue',
    rk: 'WELL_HEADER_/filterC/',
    app: 'GEOGRAPHIX',
    asset: 'WELL_HEADER',
    label: 'Blue',
    filter: '/filterC/',
    repo: '\\\\server\\share\\place\\longname'
  },
  {
    id: 'GEOGRAPHIX--(repo path)--Blue',
    rk: 'DIRECTIONAL_SURVEY_/filterD/',
    app: 'GEOGRAPHIX',
    asset: 'DIRECTIONAL_SURVEY',
    label: 'Blue',
    filter: '/filterD/',
    repo: '\\\\server\\share\\place\\longname'
  }
]

const reformat = data => {
  const a = []
  const h = {}

  for (const o of data) {
    if (a.some(e => e.id === o.id)) {
      let x = a.filter(e => e.id === o.id)[0]
      x.assets.push({ asset: o.asset, filter: o.filter })

      // a contains this job id?
      //let x = a.filter((e, i) => {
      //  if (e.id === o.id) {
      //  }
      //})
      //x.repo = o.repo
    } else {
      // push "stub" job object to a
      a.push({
        id: o.id,
        repo: o.repo,
        label: o.label,
        assets: [{ asset: o.asset, filter: o.filter }]
      })
    }
  }

  console.log(util.inspect(a, false, null, true))
}

reformat(data)
