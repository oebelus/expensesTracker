import { useEffect, useReducer } from "react"
import { initialState, reducer } from "../../context"
import axios from "axios"
import { getError } from "../../utils/utils"
import { ApiError } from "../../types/ApiError"

export default function SavingPlans() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const user = state.user
    const savings = state.savings 

    useEffect(() => {
        axios.get(`http://localhost:4000/savings/${user._id}`)
        .then((response) => {
            console.log(response.data)
        dispatch({type: 'FETCH_SAVING', payload: response.data})
        
        })
        .catch((error) => console.log(getError(error as ApiError)))
    }, [user._id])

    return (
        <div className="dark:bg-gray-800 dark:text-gray-100 rounded-lg p-4">
            <h1 className="text-xl font-bold text-center mt-4">Your 2024 Saving Plans</h1>
            { savings.length > 0 ? 
                savings.map((saving, key) => (
                <div key={key} className="p-2 sm:flex sm:space-x-2 dark:bg-gray-800 dark:text-gray-100">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <h2 className="font-semibold">{saving.name}</h2>
                      <div className="sm:w-[500px] lg:w-[290px] flex gap-10 justify-between">
                        <span className="text-sm dark:text-gray-400 mb-2">{saving.remaining}{state.currency} / {saving.amount}{state.currency}</span>
                        <span className="text-sm text-gray-800 dark:text-white">{((saving.remaining / saving.amount)*100).toFixed(2)}%</span>
                        </div>
                        <div 
                            className="w-full flex h-2 bg-gray-200 rounded-full overflow dark:bg-gray-700" 
                            role="progressbar" 
                            aria-valuemin={0} 
                            aria-valuemax={100}
                        >
                            <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style={{"width": `${(saving.remaining / saving.amount)*100}%`}}></div>
                        </div>
                      </div>
                    </div>
                </div>
              ))
              :
              <div className="mt-4 text-white-700 px-4 py-3" role="alert">
                <p>Add Your First <a className="text-violet-600 hover:text-violet-700 font-bold" href={`${window.location.pathname.replace(window.location.pathname, "saving")}`}>Saving Plan</a></p>
              </div>
            }
        </div>
    )
}
