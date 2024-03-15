import { faArrowRight, faBasketball, faBurger, faBus, faGamepad, faHouse, faPen, faPlus, faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useReducer, useState } from "react"
import { ApiError } from "../types/ApiError"
import { getError } from "../../utils"
import { Budget } from "../types/Budget"
import { initialState, reducer } from "../context"
import Months from "./dashboard/Months"
import Years from "./dashboard/Years"
import AddBudget from "./Modals.tsx/Budgeting/AddBudget"
import EditBudget from "./Modals.tsx/Budgeting/EditBudget"

export default function Budgeting() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const user = state.user
  const budgets = state.budgets
  const transactions = state.transactions

  const [suggestion, setSuggestion] = useState("")
  
  const [add, setAdd] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)

  const [budget, setBudget] = useState<Budget>()

  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [years, setYears] = useState<number[]>([])
  const last = new Date().getFullYear()

  const [clickedYear, setClickedYear] = useState<number>(new Date().getFullYear())

  const [month, setMonth] = useState<number>((new Date()).getMonth())
  const [monthly, setMonthly] = useState<Budget[]>([])
  const [yearly, setYearly] = useState<Budget[]>([])

  useEffect(() => {
    const filterByYear = budgets.filter((budget) => {
      const budgetYear = new Date(budget.createdAt).getFullYear() as number
      return budgetYear === clickedYear
    })
    setYearly(filterByYear)
    
  }, [budgets, clickedYear])

  useEffect(() => {
    const filterByMonth = yearly.filter((budget) => {
      const budgetMonth = new Date(budget.createdAt).getMonth() as number
      return budgetMonth === month
    })
    setMonthly(filterByMonth)
  }, [month, yearly])

  useEffect(() => {
    axios.get(`http://localhost:4000/budgets/${user._id}`)
    .then((response) => {
      dispatch({type: 'FETCH_BUDGET', payload: response.data})
    })
    .catch((err) => getError(err as ApiError))
  }, [user._id, budgets])

  useEffect(() => {
    const length = budgets.length
    for (let i = 0; i < length; i++) {
      if (budgets[i].recurring && (new Date(budgets[0].createdAt).getMonth()) !== new Date().getMonth()) {
        axios.post(`http://localhost:4000/budgets/addBudget/${user._id}`, {
          amount: budgets[i].amount,
          name: budgets[i].name,
          remaining: budgets[i].amount,
          isFull: true,
          recurring: true,
        })
      }
    }
  })

  useEffect(() => {
    axios.get(`http://localhost:4000/transactions/${user._id}`)
    .then((response) => {
      dispatch({type: 'FETCH_TX', payload: response.data})
      setYear(new Date(response.data[0].date).getFullYear())
      setYears(Array.from({length: last- year + 1}, (_, index) => year + index))
    })
    .catch((err) => getError(err as ApiError))
  }, [user._id, transactions, last, year])

  const suggested = [
    { name: "Home", icon: faHouse },
    { name: "Groceries", icon: faBurger },
    { name: "Shopping", icon: faShoppingBag },
    { name: "Transport", icon: faBus },
    { name: "Entertainment", icon: faGamepad },
    { name: "Gym", icon: faBasketball },
  ]

  const closeAdd = () => {
    setAdd(false)
  }

  const closeEdit = () => {
    setSuggestion("")
    console.log(suggestion)
    setEdit(false)
  }

  const openEdit = (selectedBudget: Budget) => {
    setEdit(true)
    setBudget(selectedBudget)
  }

  const handleAdd = () => {
    setAdd(true)
  }

  useEffect(() => {
    
  })

  const suggestedBudget = (suggested: {name: string}) => {
    setAdd(true)
    setSuggestion(suggested.name)
    setBudget(undefined)
    console.log(suggestion)
  }

  return (
    <div className="p-6 dark:bg-gray-800 dark:text-gray-50">
      <h1 className="text-3xl font-bold mb-4">Budget</h1>
      <p className="ml-4 mb-6"><FontAwesomeIcon icon={faArrowRight}/> Set your monthly spending limits</p>
      <h2 className="text-2xl mb-2">Your budgets:</h2>
      <button className="p-4" onClick={handleAdd}><FontAwesomeIcon icon={faPlus}/> Add a Budget</button>
      <AddBudget add={add} closeAdd={closeAdd} transactions={transactions} suggestion={suggestion}/>
      {budget && <EditBudget edit={edit} closeEdit={closeEdit} budget={budget}/>}
          <div className="p-6 flex gap-4 lg:w-[64%]">
            <Months setMonth={setMonth} />
            <Years years={years} setClickedYear={setClickedYear} />
          </div>
      {
        monthly.length > 0 && budgets.map((budget, key) => {
          return (
            <div key={key} className="lg:w-[65%] p-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{budget.name} <button onClick={() => openEdit(budget)}><FontAwesomeIcon icon={faPen}/></button></h3>
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm">{budget.remaining} {state.currency} of {budget.amount} {state.currency}</span>
                <span className="text-sm text-gray-800 dark:text-white">You used {(100-(budget.remaining / budget.amount)*100).toFixed(2)}%</span>
              </div>
              <div 
                className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" 
                role="progressbar" 
                aria-valuenow={0} 
                aria-valuemin={0} 
                aria-valuemax={100}
              >
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-violet-500" style={{"width": `${(100-(budget.remaining / budget.amount)*100) > 100 ? 100 : (100-(budget.remaining / budget.amount)*100)}%`}}></div>
              </div>
            </div>
          )
        })
      }
      <div>
        <h2 className="text-2xl mt-10">Suggested Budgets:</h2>
        {
          suggested.map((suggestion, key) => {
            return (
              <div onClick={() => suggestedBudget(suggestion)} className="flex gap-4 mt-6 p-4 lg:ml-5 border rounded-lg lg:w-[60%]" style={{"cursor": "pointer"}} key={key}>
                <FontAwesomeIcon className="mt-5" icon={suggestion.icon}/>
                <div>
                  <h3>{suggestion.name}</h3>
                  <p>Set a Budget for this category</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
