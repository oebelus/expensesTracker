import axios from "axios"
import { useState } from "react"
import { getError } from "../../utils"
import { ApiError } from "../types/ApiError"

export default function Wallet() {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [recurring, setRecurring] = useState(false)

  const userId = localStorage.getItem("userId")

  const dictionary: Record<string, boolean> = {
    "yes": true,
    "no": false
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    console.log("userId", userId)
    await axios.post(`http://localhost:4000/transactions/AddTransaction/${userId}`, {
      name,
      amount,
      category,
      date,
      recurring
    })
    .then((response) => {console.log(userId); console.log("response", response, response.data.userId)})
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
              <label htmlFor="firstname" className="text-sm">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder="Name" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="transaction" className="text-sm">Amount</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" type="number" placeholder="Amount" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="category" className="text-sm">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} id="category" type="text" placeholder="Category" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="date" className="text-sm">Date</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} id="date" type="date" placeholder="Date" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
            </div>
            <div className="col-span-full sm:col-span-2">
              <label htmlFor="state" className="text-sm block">Is it recurring?</label>
                <div className="flex items-center">
                  <input onChange={(e) => setRecurring(dictionary[e.target.value])} id="yes" type="radio" name="recurring" value="yes" className="mr-1 h-4 w-4 text-blue-600 focus:ring-blue-500" required/>
                  <label htmlFor="yes" className="text-sm mr-4 cursor-pointer select-none">Yes</label>
                  <input onChange={(e) => setRecurring(dictionary[e.target.value])} id="no" type="radio" name="recurring" value="no" className="mr-1 h-4 w-4 text-blue-600 focus:ring-blue-500"required />
                  <label htmlFor="no" className="text-sm cursor-pointer select-none">No</label>
                </div>
            </div>
          </div>
          <button type="submit" className="px-4 py-2 border rounded-md dark:border-gray-100">Add Transaction</button>
        </fieldset>
      </form>
  )
}
