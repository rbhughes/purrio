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
