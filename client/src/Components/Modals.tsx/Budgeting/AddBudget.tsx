import { Modal } from "@mui/material";
import { useReducer, useState } from "react";
import { initialState, reducer } from "../../../context";
import { Budget } from "../../../types/Budget";
import axios from "axios";
import { toast } from "react-toastify";
import { dictionary, getError } from "../../../utils/utils";
import { ApiError } from "../../../types/ApiError";
import { Transaction } from "../../../types/Transaction";

interface AddBudgetProps {
    add: boolean;
    closeAdd: () => void;
    transactions: Transaction[];
    suggestion?: string
}

export default function AddBudget({add, closeAdd, transactions, suggestion}: AddBudgetProps) {
    const [amount, setAmount] = useState<Budget["amount"]>()
    const [name, setName] = useState<Budget["name"]>(suggestion ? suggestion : "")
    const [remaining, setRemaining] = useState<Budget["remaining"]>()
    const [recurring, setRecurring] = useState<Budget["recurring"]>(false)

    const [state, dispatch] = useReducer(reducer, initialState)
    const user = state.user

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        let updatedRemaining = remaining
        transactions.forEach((transaction) => {
          return updatedRemaining! -= transaction.category === name && new Date(transaction.date).getMonth() === (new Date()).getMonth() ? Math.abs(transaction.amount) : 0
        })
        axios.post(`http://localhost:4000/budgets/addBudget/${user._id}`, {
          amount,
          name: suggestion ? suggestion : name,
          remaining: updatedRemaining,
          isFull: remaining! > amount! ? true : false,
          recurring: recurring,
        }).then((response) => {
            toast.success("Budget Added Successfully!")
            dispatch({type: 'ADD_BUDGET', payload: response.data})
            closeAdd()
        })
        .catch((err) => toast.error(getError(err as ApiError)))
    }

    return (
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
                <p className="text-xs">Provide Your Budget Details</p>
                </div>
                <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
                <div className="col-span-full sm:col-span-3">
                    <label htmlFor="firstname" className="text-sm mb-2">Name</label>
                    <input value={suggestion ? suggestion : name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder="Name" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" />
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
    )
}
