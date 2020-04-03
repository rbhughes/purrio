const counter = () => {
  return 'SELECT COUNT(*) as count FROM well;'
}

const selector = () => {
  return 'SELECT * FROM well ORDER BY uwi;'

  /*
  const sql =
    'SELECT \
    uwi,\
    primary_source,\
    well_govt_id,\
    well_name,\
    well_number,\
    legal_survey_type,\
    surface_node_id,\
    base_node_id,\
    surface_latitude,\
    surface_longitude,\
    surface_longitude,\
    bottom_hole_latitude,\
    bottom_hole_longitude,\
    geodetic_datum_id,\
    parent_uwi,\
    parent_relationship_type,\
    well_intersect_md,\
    operator,\
    td_form,\
    gx_td_form_alias,\
    td_form_age,\
    oldest_form,\
    gx_oldest_form_alias,\
    oldest_form_age,\
    initial_class,\
    current_class,\
    current_status,\
    current_status_date,\
    profile_type,\
    final_td,\
    drill_td,\
    log_td,\
    max_tvd,\
    plugback_depth,\
    whipstock_depth,\
    spud_date,\
    rig_release_date,\
    final_drill_date,\
    completion_date,\
    abandonment_date,\
    assigned_field,\
    lease_number,\
    lease_name,\
    geologic_province,\
    geographic_region,\
    regulatory_agency,\
    district,\
    county,\
    province_state,\
    country,\
    depth_datum,\
    depth_datum_elev,\
    kb_elev,\
    ground_elev,\
    plot_symbol,\
    casing_flange_elev,\
    ground_elev_type,\
    water_depth,\
    water_depth_datum,\
    platform_id,\
    platform_source,\
    plot_name,\
    discovery_ind,\
    faulted_ind,\
    confidential_type,\
    confidential_date,\
    confidential_depth,\
    confidential_form,\
    source_document,\
    tax_credit_code,\
    net_pay,\
    net_pay_ouom,\
    whipstock_depth_ouom,\
    water_depth_ouom,\
    max_tvd_ouom,\
    depth_datum_elev_ouom,\
    plugback_depth_ouom,\
    kb_elev_ouom,\
    ground_elev_ouom,\
    drill_td_ouom,\
    confidential_depth_ouom,\
    casing_flange_elev_ouom,\
    log_td_ouom,\
    final_td_ouom,\
    gx_formid,\
    gx_formid_alias,\
    gx_alternate_id,\
    gx_old_id,\
    gx_user1,\
    gx_user2,\
    gx_original_units,\
    gx_bottom_hole_y_offset,\
    gx_bottom_hole_ns_direction,\
    gx_bottom_hole_x_offset,\
    gx_bottom_hole_ew_direction,\
    gx_bottom_hole_tvd,\
    gx_rigfloor_elev,\
    gx_permit_date,\
    gx_user_date,\
    gx_location_string,\
    gx_legal_string,\
    gx_remarks,\
    gx_dev_well_blob,\
    row_changed_date,\
    gx_mag_declination,\
    gx_percent_allocation,\
    common_well_name,\
    original_operator,\
    ggx_internal_status,\
    gx_wsn,\
    gx_proposed_flag\
    FROM well;'
    */
}

const steps = () => {
  return [{ query: 'selector' }, { publish: 'stdout' }]
}

exports.handler = async (event, context) => {
  const { chunk = 1000 } = event
  return {
    chunk: chunk,
    counter: counter(),
    selector: selector(),
    steps: steps()
  }
}
