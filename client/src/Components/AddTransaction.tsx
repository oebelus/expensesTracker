import axios from "axios"
import { useEffect, useReducer, useState } from "react"
import { getError } from "../../utils"
import { ApiError } from "../types/ApiError"
import { Transaction } from "../types/Transaction"
import { initialState, reducer } from "../context"
import { toast } from "react-toastify"

export default function Wallet() {
  const [name, setName] = useState<Transaction['name']>("")
  const [amount, setAmount] = useState<Transaction['amount']>("")
  const [category, setCategory] = useState<Transaction['category']>("")
  const [date, setDate] = useState<Transaction['date']>(new Date())
  const [recurring, setRecurring] = useState<Transaction['recurring']>(false)
  const [txType, setTxType] = useState<Transaction['txType']>("")
  const [budgetId, setBudgetId] = useState("")

  const dictionary: Record<string, boolean> = {
    "yes": true,
    "no": false
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const user = state.user
  const budgets = state.budgets

  useEffect(() => {
    axios.get(`http://localhost:4000/budgets/${user._id}`).then(
      (response) => {
        dispatch({type: 'FETCH_BUDGET', payload: response.data})
      }
    )
  }, [user._id])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    const parseDate = new Date(selectedDate)
    setDate(parseDate)
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const length = budgets.length
    
    for (let i = 0; i < length; i++) {
      if (budgets[i].name.toLowerCase() === category.toLowerCase()) {
        setBudgetId(budgets[i]._id)
        const remaining = budgets[i].remaining - parseFloat(amount) 
        axios.put(`http://localhost:4000/budgets/editBudget/${user._id}/${budgetId}`, {
          remaining: remaining,
          amount: budgets[i].amount,
          name: budgets[i].name,
          recurring: budgets[i].recurring,
          isFull: remaining <= budgets[i].amount ? true : false
        })
        .then(() => {
          dispatch({type: 'UPDATE_BUDGET', payload: budgets[i]})
          toast.success(`Budget: "${budgets[i].name}" Updated Successfully`)
        })
        .catch((err) => getError(err as ApiError))
      }
    }
    await axios.post(`http://localhost:4000/transactions/AddTransaction/${user._id}`, {
      name,
      amount: txType === "expense" ? `-${amount}` : `+${amount}`,
      category,
      date,
      recurring,
      txType
    })
    .then((response) => {
      dispatch({type: 'ADD_TX', payload: response.data})
    })
    .catch((err) => console.log(getError(err as ApiError)))
  }

  return (
      <form onSubmit={handleSubmit} className="container flex flex-col mx-auto space-y-12">
        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-medium">Add a Transaction</p>
            <p className="text-xs">Provide Your Transaction details</p>
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="firstname" className="text-sm mb-2">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder="Name" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="transaction" className="text-sm mb-2">Amount</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" type="number" placeholder="Amount" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="category" className="text-sm mb-2">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} id="category" type="text" placeholder="Category" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="date" className="text-sm mb-2">Date</label>
              <input value={date.toISOString().substr(0, 10)} onChange={handleDateChange} id="date" type="date" placeholder="Date" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>  
            </div>
            <div className="col-span-full sm:col-span-2">
              <label htmlFor="state" className="text-sm block mb-2">Is it recurring?</label>
                <div className="flex">
                  <div className="flex items-center mr-4">
                      <input id="yes" type="radio" name="recurring" onChange={(e) => setRecurring(dictionary[e.target.value])} value="yes" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      <label htmlFor="yes" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                  </div>
                  <div className="flex items-center">
                      <input id="no" type="radio" name="recurring" onChange={(e) => setRecurring(dictionary[e.target.value])} value="no" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      <label htmlFor="no" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                  </div>
                </div>
            </div>
            <div className="col-span-full sm:col-span-2">
              <label htmlFor="state" className="text-sm block mb-2">Transaction Type</label>
                <div className="flex">
                  <div className="flex items-center mr-4">
                      <input id="expense" type="radio" name="txType" onChange={(e) => setTxType(e.target.value)} value="expense" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      <label htmlFor="expense" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Expense</label>
                  </div>
                  <div className="flex items-center">
                      <input id="income" type="radio" name="txType" onChange={(e) => setTxType(e.target.value)} value="income" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      <label htmlFor="income" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Income</label>
                  </div>
                </div>
            </div>
          </div>
          <button type="submit" style={{"width": "90%"}} className="px-4 py-2 border rounded-md dark:border-gray-100">Add</button>
        </fieldset>
      </form>
  )
}
