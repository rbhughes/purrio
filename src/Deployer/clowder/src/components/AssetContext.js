import React, { useState, useEffect } from 'react'
import { API, graphqlOperation } from 'aws-amplify'

const assetChoice = `query metaStuff {
  __type(name: "Asset"){
    enumValues {
      name
    }
  }
}`

const AssetContext = React.createContext()

// Define what fields we use for filter in the GUI form
// This would ideally be part of the asset enum in schema.graphql.
/*
// TODO: Update this if the Enum changes
const assetWhereClauseFields = {
  BUSINESS_ASSOCIATE: ['tbd'],
  DIGITAL_LOG: ['tbd'],
  DIRECTIONAL_SURVEY: ['UWI'],
  FORMATION_TOP: ['tbd'],
  LEGAL_DESCRIPTION: ['tbd'],
  PRODUCTION: ['tbd'],
  RASTER_LOG: ['tbd'],
  STRAT_COLUMN: ['tbd'],
  WELL_HEADER: ['tbd']
}
*/

const AssetProvider = props => {
  const [assetList, setAssetList] = useState([])

  const fetchAssets = async () => {
    try {
      let res = await API.graphql(graphqlOperation(assetChoice))
      let assetList = res.data.__type.enumValues.map(o => ({
        key: o.name,
        text: o.name,
        value: o.name
      }))
      setAssetList(assetList)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  return (
    <AssetContext.Provider value={assetList}>
      {props.children}
    </AssetContext.Provider>
  )
}

export { AssetProvider, AssetContext }
