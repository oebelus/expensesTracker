import { useReducer } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { initialState, reducer } from "../context"

export default function ProtectedRoute() {
    const [ state, ] = useReducer(reducer, initialState)
    const user = state.user

    if (user) {
        return <Outlet/> 
    } else {
        return <Navigate to="/login"/>
    }
}