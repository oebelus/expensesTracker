import { faArrowRight, faBasketball, faBurger, faBus, faGamepad, faHouse, faPen, faPlus, faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useState } from "react"
import { ApiError } from "../types/ApiError"
import { getError } from "../../utils"
import { Modal } from "@mui/material"

export default function Budget() {
  const [addBudget, setAddBudget] = useState(false)
  const [empty, setEmpty] = useState(false)

  const [add, setAdd] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [del, setDel] = useState<boolean>(false)

  const [amount, setAmount] = useState<Budget["amount"]>()
  const [name, setName] = useState<Budget["name"]>("")
  const [remaining, setRemaining] = useState<Budget["remaining"]>()
  const [isFull, setIsFull] = useState<Budget["isFull"]>(false)
  const [recurring, setRecurring] = useState<Budget["recurring"]>(false)
  const [budgetId, setBudgetId] = useState<Budget["_id"]>("")
  const [data, setData] = useState<Budget[]>([])

  const dictionary: Record<string, boolean> = {
    "true": true,
    "false": false,
  }

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    axios.get(`http://localhost:4000/budgets/${userId}`)
    .then((response) => {
      setData(response.data)
    })
    .catch((err) => getError(err as ApiError))
  }, [data, userId])

  const handleSubmit = (e:React.SyntheticEvent) => {
    e.preventDefault();
    axios.post(`http://localhost:4000/budgets/addBudget/${userId}`, {
      amount,
      name,
      remaining,
      isFull: remaining === amount ? true : false,
      recurring: recurring,
    }).then((response) => {console.log("response", response, response.data.userId)})
    .catch((err) => console.log(getError(err as ApiError)))
  }

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
    setEdit(false)
  }

  const printtx = () => {
    axios.get(`http://localhost:4000/budgets/${userId}`)
    .then((response) => {
      console.log(response.data)
    })
    .catch((err) => getError(err as ApiError))
  }

  const openEdit = (selectedBudget: Budget) => {
    setEdit(true)
    setName(selectedBudget.name)
    setAmount(selectedBudget.amount)
    setRemaining(selectedBudget.remaining)
    setBudgetId(selectedBudget._id)
    console.log(budgetId)
  }

  const handleEdit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    axios.put(`http://localhost:4000/budgets/editBudget/${userId}/${budgetId}`, {
          remaining: remaining,
          amount: amount,
          name: name,
          recurring: recurring,
          isFull: remaining! <= amount! ? true : false
    }).then((response) => console.log("DONE", response, remaining)).catch((err) => getError(err as ApiError))
  }

  return (
    <div onClick={printtx} className="p-6 dark:bg-gray-800 dark:text-gray-50">
      <h1 className="text-3xl font-bold mb-4">Budget</h1>
      <p className="ml-4 mb-6"><FontAwesomeIcon icon={faArrowRight}/> Set your monthly spending limits</p>
      <h2 className="text-2xl mb-10">Your budgets:</h2>
      <button className="p-4" onClick={()=>setAdd(true)}><FontAwesomeIcon icon={faPlus}/> Add a Budget</button>
      <Modal
          open={add}
          onClose={closeAdd}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <form onSubmit={handleSubmit} className="mt-40 text-white container flex flex-col mx-auto space-y-12">
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Add a Budget</p>
              <p className="text-xs">Provide Your Budget details</p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="firstname" className="text-sm mb-2">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder="Name" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="transaction" className="text-sm mb-2">Amount</label>
                <input value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} id="amount" type="number" placeholder="Amount" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="remaining" className="text-sm mb-2">Remaining</label>
                <input value={remaining} onChange={(e) => setRemaining(parseInt(e.target.value))} id="category" type="number" placeholder="Category" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
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
            </div>
            <button type="submit" style={{"width": "90%"}} className="px-4 py-2 border rounded-md dark:border-gray-100">Add</button>
          </fieldset>
        </form>  
      </Modal>
      <Modal
          open={edit}
          onClose={closeEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <form onSubmit={handleEdit} className="mt-40 text-white container flex flex-col mx-auto space-y-12">
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Add a Budget</p>
              <p className="text-xs">Provide Your Budget details</p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="firstname" className="text-sm mb-2">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder="Name" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="transaction" className="text-sm mb-2">Amount</label>
                <input value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} id="amount" type="number" placeholder="Amount" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="remaining" className="text-sm mb-2">Remaining</label>
                <input value={remaining} onChange={(e) => setRemaining(e.target.value)} id="category" type="number" placeholder="Category" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
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
            </div>
            <button type="submit" style={{"width": "90%"}} className="px-4 py-2 border rounded-md dark:border-gray-100">Save</button>
          </fieldset>
        </form>  
      </Modal>
      {
        data.length > 0 && data.map((budget, key) => {
          return (
            <div key={key} className="lg:w-[65%] p-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{budget.name} <button onClick={() => openEdit(budget)}><FontAwesomeIcon icon={faPen}/></button></h3>
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm">${budget.remaining} of ${budget.amount}</span>
                <span className="text-sm text-gray-800 dark:text-white">You used {(budget.remaining / budget.amount)*100}%</span>
              </div>
              <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style={{"width": "25%"}}></div>
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
              <div className="flex gap-4 mt-6 p-4 lg:ml-5 border rounded-lg lg:w-[60%]" style={{"cursor": "pointer"}} key={key}>
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
