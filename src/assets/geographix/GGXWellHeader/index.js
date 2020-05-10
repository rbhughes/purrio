const WHERE_FIELDS = ['a.uwi']
const CHUNK = 1000

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
  const sql = `SELECT COUNT(DISTINCT(a.uwi)) AS count FROM well a ` + `${where}`
  return sql
}

const selector = (where) => {
  const select =
    `SELECT ` +
    `a.uwi, ` +
    `a.geologic_province AS area, ` +
    `a.assigned_field, ` +
    `a.current_class AS class, ` +
    `a.common_well_name, ` +
    `a.completion_date, ` +
    `a.country, ` +
    `a.county, ` +
    `a.row_changed_date AS data_date, ` +
    `a.district, ` +
    `a.depth_datum_elev AS datum_elevation, ` +
    `a.depth_datum AS datum_reference, ` +
    `a.td_form AS formation_at_td, ` +
    `a.ground_elev AS ground_elevation, ` +
    `a.gx_alternate_id, ` +
    `a.gx_old_id, ` +
    `a.gx_user1, ` +
    `a.gx_user2, ` +
    `a.gx_user_date, ` +
    `a.ggx_internal_status AS internal_status, ` +
    `(CASE (SELECT COUNT(station_md) ` +
    `  FROM well_dir_srvy_station WHERE uwi = a.uwi) ` +
    `  WHEN 0 THEN 0 ELSE 1 END) AS is_deviated, ` +
    `a.gx_proposed_flag AS is_proposed, ` +
    `a.surface_latitude AS latitude, ` +
    `a.lease_name, ` +
    `(SELECT remark FROM legal_congress_loc WHERE a.uwi = uwi ` +
    `  AND a.legal_survey_type = location_type) AS location_congress, ` +
    `(SELECT remark FROM legal_dls_loc WHERE a.uwi = uwi ` +
    `  AND a.legal_survey_type = location_type) AS location_dls, ` +
    `(SELECT remark FROM legal_ne_loc WHERE a.uwi = uwi ` +
    `  AND a.legal_survey_type = location_type) AS location_ne, ` +
    `(SELECT remark FROM legal_offshore_loc WHERE a.uwi = uwi ` +
    `  AND a.legal_survey_type = location_type) AS location_offshore, ` +
    `(SELECT remark FROM legal_texas_loc WHERE a.uwi = uwi ` +
    `  AND a.legal_survey_type = location_type) AS location_texas, ` +
    `a.surface_longitude AS longitude, ` +
    `a.operator, ` +
    `a.original_operator, ` +
    `a.parent_relationship_type AS parent_type, ` +
    `a.gx_permit_date AS permit_date, ` +
    `a.well_govt_id AS permit_number, ` +
    `a.platform_id, ` +
    `a.plugback_depth, ` +
    `a.province_state, ` +
    `(SELECT COUNT(log_section_name) FROM log_image_reg_log_section ` +
    `  WHERE well_id = a.uwi) AS raster_logs, ` +
    `a.spud_date, ` +
    `a.current_status AS status, ` +
    `a.final_td AS total_depth, ` +
    `a.gx_location_string as township_range_section, ` +
    `(SELECT COUNT(curvename) FROM gx_well_curve ` +
    `  WHERE wellid = a.uwi) AS vector_logs, ` +
    `a.water_depth, ` +
    `a.water_depth_datum, ` +
    `a.well_name, ` +
    `a.well_number, ` +
    `a.gx_wsn AS wsn ` +
    `FROM well a`

  const order = 'ORDER BY a.uwi'

  return { select: select, where: where, order: order }
}

const steps = () => {
  return [{ query: 'selector' }, { publish: 'stdout' }]
}

exports.handler = async (event, context) => {
  const chunk = event.q_chunk ? event.q_chunk : CHUNK
  const where = sanitizedWhereClause(event.q_filter)
  return {
    chunk: parseInt(chunk),
    counter: counter(where),
    selector: selector(where)
  }
}
