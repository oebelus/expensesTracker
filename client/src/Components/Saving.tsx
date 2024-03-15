import { faArrowRight, faCar, faHouse, faLaptop, faPen, faPills, faPlane, faPlus, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Modal } from "@mui/material"
import axios from "axios"
import { useEffect, useReducer, useState } from "react"
import { getError } from "../../utils"
import { ApiError } from "../types/ApiError"
import { toast } from "react-toastify"
import { Budget } from "../types/Budget"
import { initialState, reducer } from "../context"

export default function Budgets() {
  const suggested = [
    { name: "Travel", icon: faPlane },
    { name: "Health", icon: faPills },
    { name: "Car", icon: faCar },
    { name: "Home", icon: faHouse },
    { name: "A New PC", icon: faLaptop },
  ]

  const tips = [
    { title: "Set up recurring transfers", p: "Automate your savings by setting up recurring transfers from your checking account to your savings account. This ensures that you consistently save money without having to remember to do it manually each time." },
    { title: "Turn off automatic payments", p: "Review your automatic payments regularly to ensure you're not paying for services or subscriptions you no longer use. Turning off unnecessary automatic payments can help you save money each month." },
    { title: "Pay your credit card balance in full", p: "Avoid accruing interest by paying off your credit card balance in full each month. This helps maintain a healthy credit score and saves you money on interest charges." },
    { title: "Pay off your debt", p: "Create a plan to pay off your debt systematically. Start by focusing on high-interest debt first while making minimum payments on other debts. As you pay off each debt, allocate the freed-up funds towards the next debt until you become debt-free." }
];

  const [add, setAdd] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)

  const [amount, setAmount] = useState<Budget["amount"]>()
  const [name, setName] = useState<Budget["name"]>("")
  const [remaining, setRemaining] = useState<Budget["remaining"]>()
  const [savingId, setSavingId] = useState<Budget["_id"]>("")
  const [data, setData] = useState<Budget[]>([])

  const [state, ] = useReducer(reducer, initialState)
  const userId = state.user._id

  useEffect(() => {
    axios.get(`http://localhost:4000/savings/${userId}`)
    .then((response) => {
      setData(response.data)
    })
    .catch((err) => getError(err as ApiError))
  }, [data, userId])

  const handleSubmit = (e:React.SyntheticEvent) => {
    e.preventDefault();
    axios.post(`http://localhost:4000/savings/addSaving/${userId}`, {
      amount,
      name,
      remaining,
      isFull: remaining! > amount! ? true : false,
    }).then(() => {
      toast.success("Saving Plan Added Successfully!")
      setAdd(false)
    })
    .catch((err) => toast.error(getError(err as ApiError)))
  }

  const closeAdd = () => {
    setAdd(false)
  }

  const closeEdit = () => {
    setEdit(false)
  }

  const openEdit = (selectedSaving: Budget) => {
    setEdit(true)
    setName(selectedSaving.name)
    setAmount(selectedSaving.amount)
    setRemaining(selectedSaving.remaining)
    setSavingId(selectedSaving._id)
  }

  const handleEdit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    axios.put(`http://localhost:4000/savings/editSaving/${userId}/${savingId}`, {
          remaining: remaining,
          amount: amount,
          name: name,
          isFull: remaining! <= amount! ? true : false
    }).then(() => toast.success("Saving Edited Successfully")).catch((err) => toast.error(getError(err as ApiError)))
    setEdit(false)
  }

  const handleDelete = () => {
    axios.delete(`http://localhost:4000/savings/deleteSaving/${userId}/${savingId}`)
    .then(() => {
      toast("Saving Deleted Successfully!")
      setEdit(false)
    })
    .catch((err) => getError(err as ApiError));
  }

  const handleAdd = () => {
    setAdd(true)
    setName("")
    setAmount(0)
    setRemaining(0)
  }

  const suggestedSaving = (suggested: {name: string}) => {
    setAdd(true)
    setName(suggested.name)
  }

  return (
    <div className="p-6 dark:bg-gray-800 dark:text-gray-50">
      <h1 className="text-3xl font-bold mb-4">Your Yearly Savings</h1>
      <p className="ml-4 mb-6"><FontAwesomeIcon icon={faArrowRight}/> Set your monthly spending limits</p>
      <h2 className="text-2xl mb-10">Your Savings:</h2>
      <button className="p-4" onClick={handleAdd}><FontAwesomeIcon icon={faPlus}/> Add a Saving Plan</button>
      <Modal
          open={add}
          onClose={closeAdd}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <form onSubmit={handleSubmit} className="mt-40 text-white container flex flex-col mx-auto space-y-12">
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Add a Saving Plan</p>
              <p className="text-xs">Provide Your Saving Plan Details</p>
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
              <p className="font-medium">Edit {name} Saving Plan</p>
              <p className="text-xs">Modify Your Saving Plan Details</p>
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
            </div>
            <div className="flex gap-4">
              <button type="submit" style={{"width": "90%"}} className="px-4 py-2 border rounded-md dark:border-gray-100">Save</button>
              <button onClick={handleDelete} style={{"width": "90%"}} className="px-4 py-2 border rounded-md bg-violet-600 dark:border-gray-100">Delete</button>
            </div>
          </fieldset>
        </form>  
      </Modal>

      <div>
      {
        data.length > 0 && data.map((saving, key) => {
          return (
            <div key={key} className="lg:w-[65%] p-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{saving.name} <button onClick={() => openEdit(saving)}><FontAwesomeIcon icon={faPen}/></button></h3>
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm">You have saved {saving.remaining} {state.currency} towards your goal of {saving.amount} {state.currency}</span>
                <span className="text-sm text-gray-800 dark:text-white">{(saving.remaining / saving.amount)*100}%</span>
              </div>
              <div 
                className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" 
                role="progressbar" 
                aria-valuenow={100-(saving.remaining / saving.amount)*100} 
                aria-valuemin={0} 
                aria-valuemax={100}
              >
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style={{"width": `${(saving.remaining / saving.amount)*100}%`}}></div>
              </div>
            </div>
          )
        })
      }
        <h2 className="text-2xl mt-10">Suggested Savings:</h2>
        {
          suggested.map((suggestion, key) => {
            return (
              <div onClick={() => suggestedSaving(suggestion)} className="flex gap-4 mt-6 p-4 lg:ml-5 border rounded-lg lg:w-[60%]" style={{"cursor": "pointer"}} key={key}>
                <FontAwesomeIcon className="mt-5" icon={suggestion.icon}/>
                <div>
                  <h3>{suggestion.name}</h3>
                  <p>Set a Saving Plan for this category</p>
                </div>
              </div>
            )
          })
        }
        <h2 className="text-2xl mt-10">Personalized tips to to improve your saving habits:</h2>
        {
          tips.map((tip, key) => {
            return (
              <div className="flex gap-4 mt-6 p-4 lg:ml-5 rounded-lg lg:w-[60%]" style={{"cursor": "pointer"}} key={key}>
                <FontAwesomeIcon className="mt-3" icon={faWallet}/>
                <div>
                  <h3 className="font-bold text-xl">{tip.title}</h3>
                  <p>{tip.p}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
