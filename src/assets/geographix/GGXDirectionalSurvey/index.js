const whereFields = ['a.uwi']

const makeWhereClause = (filter, fields) => {
  const split = filter.split(',').map(s => s.trim())
  const a = []
  for (const s of split) {
    let x = s.match(/\%|\*/)
      ? fields.map(f => `${f} LIKE '${s}'`).join(' OR ')
      : fields.map(f => `${f} = '${s}'`).join(' OR ')
    a.push(x)
  }
  return `WHERE ${a.join(' OR ')}`
}

const counter = where => {
  const sql = `SELECT COUNT(DISTINCT(a.uwi)) AS count FROM well_dir_srvy a \
  JOIN well_dir_srvy_station b ON \
  a.uwi = b.uwi AND a.source = b.source AND a.survey_id = b.survey_id \
  ${where}`

  return sql
}

const selector = where => {
  const sql = `SELECT \
    a.uwi as filter, \
    a.uwi, \
    a.source, \
    a.survey_id, \
    a.gx_base_tvd, \
    a.gx_kop_md, \
    a.north_reference, \
    a.magnetic_declination, \
    a.gx_base_n_s_offset, \
    a.gx_base_e_w_offset, \
    a.gx_base_latitude, \
    a.gx_base_longitude, \
    a.compute_method, \
    a.gx_footage, \
    a.gx_base_location_string, \
    '[' || b.stations || ']' stations \
    FROM well_dir_srvy a \
    INNER JOIN \
    (select uwi, source, survey_id, list(\
    '{ "STATION_ID": ' || COALESCE(station_id, 'null')  || ', ' || \
    '"STATION_MD": '   || COALESCE(STR(station_md, 8, 2), 'null')  || ', ' || \
    '"STATION_TVD": '  || COALESCE(STR(station_tvd, 8, 2), 'null') || ', ' || \
    '"INCLINATION": '  || COALESCE(STR(inclination, 5, 2), 'null') || ', ' || \
    '"AZIMUTH": '      || COALESCE(STR(azimuth, 5, 2), 'null')     || ', ' || \
    '"Y_OFFSET": '     || COALESCE(STR(y_offset, 5, 2), 'null')    || ', ' || \
    '"X_OFFSET": '     || COALESCE(STR(x_offset, 5, 2), 'null')    || '}' \
    ) as stations \
    FROM well_dir_srvy_station GROUP BY uwi, source, survey_id) b \
    ON \
    a.uwi = b.uwi AND a.source = b.source AND a.survey_id = b.survey_id \
    ${where}
    ORDER BY a.uwi`

  return sql
}

const steps = () => {
  return [{ query: 'selector' }, { publish: 'stdout' }]
}

exports.handler = async (event, context) => {
  console.log('======================')
  console.log(event)
  const { chunk = 1000 } = event
  const where = makeWhereClause(event.q_filter, whereFields)
  return {
    chunk: chunk,
    counter: counter(where),
    selector: selector(where),
    steps: steps()
  }
}
