// replace * with %
//
const WHERE_FIELDS = ['a.uwi']

const sanitize = (s) => {
  return s.replace(/[^-a-z0-9%_\-]+/gi, '')
}

const sanitizedWhereClause = (filter) => {
  const a = []

  if (filter.trim().length === 0) {
    return ''
  }
  const split = filter.split(',').map((s) => s.trim())

  if (filter.match(/\%|\*/)) {
    for (const s of split) {
      const token = sanitize(s.replace(/\*/g, '%'))
      let x = token.match(/\%/)
        ? WHERE_FIELDS.map((f) => `${f} LIKE '${token}'`).join(' OR ')
        : WHERE_FIELDS.map((f) => `${f} = '${token}'`).join(' OR ')
      a.push(x)
    }
  } else {
    const tokens = split.map((s) => `'${sanitize(s)}'`)
    for (const f of WHERE_FIELDS) {
      let x = `${f} IN (${tokens.join(', ')})`
      a.push(x)
    }
  }
  return `WHERE ${a.join(' OR ')}`
}

const batchSelector = (opts) => {
  let { count, chunk, selector, where } = opts

  const selectors = []
  const start = 1
  let x = 0
  x = start

  while ((count - x) * chunk >= 0) {
    chunk = x + chunk > count ? count - x + start : chunk

    const sql =
      `SELECT TOP ${chunk} START AT ${x} ` +
      `${selector.select.substring(7)} ` + // removes 'SELECT'
      `${where} ${selector.order};`

    selectors.push(sql)

    x += chunk
  }
  return selectors
}

const counter = (where) => {
  const sql =
    `SELECT COUNT(DISTINCT(a.uwi)) AS count FROM well_dir_srvy a ` +
    `JOIN well_dir_srvy_station b ON ` +
    `a.uwi = b.uwi AND a.source = b.source AND a.survey_id = b.survey_id ` +
    `${where}`
  return sql
}

/////////////////////////////////////////////////
const q_count = 100
const q_chunk = 29

const q_selector = {
  select: 'SELECT a.uwi, a.operator, a.well_name FROM well a',
  where: null,
  order: 'ORDER BY a.uwi',
}

const filter = '0505*02340, bbbbb'

const q_where = sanitizedWhereClause(filter)

const q_counter = counter(q_where)

const b = batchSelector({
  count: q_count,
  chunk: q_chunk,
  selector: q_selector,
  where: q_where,
})
console.log(b)

/*
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
*/
