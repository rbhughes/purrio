const util = require('util')
dataZ = [
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

const data = {
  label: 'Blue',
  repo: '\\\\server\\share\\place\\longname',
  assets: [
    {
      asset: 'PRODUCTION',
      filter: 'PotatoSalad!'
    },
    {
      asset: 'WELL_HEADER',
      filter: '/an_update/'
    },
    {
      asset: 'DIRECTIONAL_SURVEY',
      filter: '/an_update/'
    }
  ]
}

const reformat = data => {
  const jobs = []
  for (const a of data.assets) {
    jobs.push({
      id: `app - ${data.repo} - ${data.label}`,
      rk: `${a.asset} - ${a.filter}`,
      asset: a.asset,
      label: data.label,
      filter: a.filter,
      repo: data.repo
    })
  }

  console.log(util.inspect(jobs, false, null, true))
}

// This "compresses" rows with unique id+rk to just unique id so that we can
// display multiple asset + filter entries per job id.
const reformatZ = data => {
  const a = []

  for (const o of data) {
    if (a.some(e => e.id === o.id)) {
      let x = a.filter(e => e.id === o.id)[0]
      x.assets.push({ asset: o.asset, filter: o.filter })
    } else {
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
