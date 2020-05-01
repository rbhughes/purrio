import React, { createContext, useContext, useReducer } from 'react'

const WorkerContext = createContext()
const initialState = {}

const reducer = (state, action) => {
  if (!state[action.id]) {
    //state[action.id] = { notes: [], itemCount: 0, batchCount: 0 }
    state[action.id] = { itemCount: 0, batchCount: 0 }
  }
  switch (action.type) {
    //case 'message':
    //  state[action.id] = {
    //    notes: state[action.id].notes.concat([action.note])
    //  }
    //  return { ...state }

    case 'increment':
      state[action.id] = {
        itemCount: state[action.id].itemCount + action.itemCount,
        batchCount: state[action.id].batchCount + action.batchCount
      }
      return { ...state }

    case 'decrement':
      state[action.id] = {
        itemCount: state[action.id].itemCount - action.itemCount,
        batchCount: state[action.id].batchCount - action.batchCount
      }
      return { ...state }
    case 'reset':
      state[action.id] = {
        itemCount: 0,
        batchCount: 0
      }
      return { ...state }

    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const WorkerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <WorkerContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkerContext.Provider>
  )
}

export const WorkerStore = () => useContext(WorkerContext)


/*
export const loadingSpin = (event, spin) => {
  event.preventDefault()
  event.persist()
  if (spin) {
    event.target.className += ' loading'
  } else {
    event.target.className = event.target.className.replace(/ loading/g, '')
  }
}
*/