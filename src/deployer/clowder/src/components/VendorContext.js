import React from 'react'

//TODO also store database credential form info here

const VendorContext = React.createContext()

const vendors = app => {
  const v = {
    geographix: {
      shortName: 'GeoGraphix',
      longName: 'GeoGraphix Discovery',
      icon: 'home',
      formInstructions:
        'Enter path to a GeoGraphix project. This will usually be a UNC path.'
    },
    kingdom: {
      shortName: 'Kingdom',
      longName: 'IHS Kingdom',
      icon: 'home',
      formInstructions:
        'Enter path to a Kingdom Project folder. For SQL Server projects, enter the credentials.'
    },
    petra: {
      shortName: 'Petra',
      longName: 'IHS Petra',
      icon: 'home',
      formInstructions: 'Enter a path for a Petra project. Yada yada yada.'
    }
  }
  return v[app.toLowerCase()]
}

const VendorProvider = props => {
  return (
    <VendorContext.Provider value={vendors}>
      {props.children}
    </VendorContext.Provider>
  )
}

export { VendorProvider, VendorContext }
