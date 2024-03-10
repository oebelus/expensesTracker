import { useEffect, useReducer } from "react"
import { initialState, reducer } from "../context"
import axios from "axios"

export default function TransactionsFetch() {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  useEffect(() => {
    axios.get(`http://localhost:4000/transactions/${state.user._id}`)
    .then((response) => {
      dispatch({type: 'FETCH_TX', payload: response.data})
    })
  })
  return (
    <div>DataFetching</div>
  )
}
