const WHERE_FIELDS = ['a.uwi']
const CHUNK = 25

const sanitize = (s) => {
  return s.replace(/[^-a-z0-9%_\-]+/gi, '')
}

// And but so...the node sqlanywhere driver allegedly supports stored procedures
// but no other functions to sanitize strings for parameterized statements.
// It makes no sense to create a stored procedure for a one-off query, so we
// severely sanitize the input string to prevent injection attacks.
//
// return empty string if no filter
// if any wildcards exist in the filter string, use LIKE or '=' as needed
// if no wildcards, use IN
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

const counter = (where) => {
  const sql =
    `SELECT COUNT(DISTINCT(a.uwi)) AS count FROM well_dir_srvy a ` +
    `JOIN well_dir_srvy_station b ON ` +
    `a.uwi = b.uwi AND a.source = b.source AND a.survey_id = b.survey_id ` +
    `${where}`
  return sql
}

const selector = (where) => {
  const select =
    `SELECT ` +
    `a.uwi as filter, ` +
    `a.uwi, ` +
    `a.source, ` +
    `a.survey_id, ` +
    `a.gx_base_tvd, ` +
    `a.gx_kop_md, ` +
    `a.north_reference, ` +
    `a.magnetic_declination, ` +
    `a.gx_base_n_s_offset, ` +
    `a.gx_base_e_w_offset, ` +
    `a.gx_base_latitude, ` +
    `a.gx_base_longitude, ` +
    `a.compute_method, ` +
    `a.gx_footage, ` +
    `a.gx_base_location_string, ` +
    `'[' || b.stations || ']' stations ` +
    `FROM well_dir_srvy a ` +
    `INNER JOIN ` +
    `(select uwi, source, survey_id, list(` +
    `'{ "STATION_ID": ' || COALESCE(station_id, 'null')             || ', ' || ` +
    `'"STATION_MD": '   || COALESCE(STR(station_md, 8, 2), 'null')  || ', ' || ` +
    `'"STATION_TVD": '  || COALESCE(STR(station_tvd, 8, 2), 'null') || ', ' || ` +
    `'"INCLINATION": '  || COALESCE(STR(inclination, 5, 2), 'null') || ', ' || ` +
    `'"AZIMUTH": '      || COALESCE(STR(azimuth, 5, 2), 'null')     || ', ' || ` +
    `'"Y_OFFSET": '     || COALESCE(STR(y_offset, 5, 2), 'null')    || ', ' || ` +
    `'"X_OFFSET": '     || COALESCE(STR(x_offset, 5, 2), 'null')    || '}' ` +
    `) as stations ` +
    `FROM well_dir_srvy_station GROUP BY uwi, source, survey_id) b ` +
    `ON ` +
    `a.uwi = b.uwi AND a.source = b.source AND a.survey_id = b.survey_id`

  const order = 'ORDER BY a.uwi'

  return { select: select, where: where, order: order }
}

exports.handler = async (event, context) => {
  const { chunk = CHUNK } = event
  const where = sanitizedWhereClause(event.q_filter)
  return {
    chunk: chunk,
    counter: counter(where),
    selector: selector(where),
  }
}
