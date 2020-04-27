/*
import React from 'react'

const WorkerContext = React.createContext()

const counts = (jobId) => {
  const counts = {}
  //counts[jobId] = { batchCount: 0, itemCount: 0 }
  counts[jobId] = {}

  return counts
}

const WorkerProvider = (props) => {
  return (
    <WorkerContext.Provider value={counts}>
      {props.children}
    </WorkerContext.Provider>
  )
}

export { WorkerProvider, WorkerContext }
*/

import React, { createContext, useContext, useReducer } from 'react'

const WorkerContext = createContext()
const initialState = {}

const reducer = (state, action) => {
  if (!state[action.id]) {
    state[action.id] = { count: 0, message: '' }
  }
  switch (action.type) {
    case 'increment':
      state[action.id] = {
        count: state[action.id].count + 1,
        message: action.message
      }
      console.log(state)
      return state
    case 'decrement':
      return {
        count: state.count - 1,
        id: (state.id = action.id),
        message: action.message
      }
    case 'reset':
      return {
        count: 0,
        message: action.message
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

/*
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        message: action.message
      }
    case 'decrement':
      return {
        count: state.count - 1,
        message: action.message
      }
    case 'reset':
      return {
        count: 0,
        message: action.message
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}
*/

export const WorkerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <WorkerContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkerContext.Provider>
  )
}

export const useStore = () => useContext(WorkerContext)
