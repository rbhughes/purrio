import React from 'react'

const VendorContext = React.createContext()

const vendors = app => {
  const v = {
    geographix: {
      aux: {
        label: 'server hostname',
        valueSetter: s => {
          // matches "server" in a UNC path--usually the GGX server
          let m = s.match(/\\\\(.+?)\\/)
          return m ? m[1] : 'localhost'
        }
      },
      shortName: 'GeoGraphix',
      longName: 'GeoGraphix Discovery',
      icon: 'home',
      formInstructions:
        'Enter path to a GeoGraphix project. This will usually be a UNC path.'
    },
    kingdom: {
      aux: {
        label: 'kingdom thing',
        valueSetter: s => s
      },
      shortName: 'Kingdom',
      longName: 'IHS Kingdom',
      icon: 'home',
      formInstructions:
        'Enter path to a Kingdom Project folder. For SQL Server projects, enter the credentials.'
    },
    petra: {
      aux: {
        label: 'petra thing',
        valueSetter: s => s
      },
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
