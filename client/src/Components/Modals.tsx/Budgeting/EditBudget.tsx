import { Modal } from '@mui/material'
import axios from 'axios';
import { useReducer, useState } from 'react';
import { Budget } from '../../../types/Budget';
import { initialState, reducer } from '../../../context';
import { toast } from 'react-toastify';
import { dictionary, getError } from '../../../../utils';
import { ApiError } from '../../../types/ApiError';

interface EditBudgetProps {
    edit: boolean;
    closeEdit: () => void
    budget: Budget
}

export default function EditBudget({edit, closeEdit, budget}: EditBudgetProps) {
    const [amount, setAmount] = useState<Budget["amount"]>(budget.amount || 0)
    const [name, setName] = useState<Budget["name"]>(budget.name)
    const [remaining, setRemaining] = useState<Budget["remaining"]>(budget.remaining || 0)
    const [recurring, setRecurring] = useState<Budget["recurring"]>(false)
    const [state, dispatch] = useReducer(reducer, initialState)
    
    const user = state.user
    
    const handleEdit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        axios.put(`http://localhost:4000/budgets/editBudget/${user._id}/${budget._id}`, {
              remaining,
              amount: amount,
              name: name,
              recurring: recurring,
              isFull: remaining! <= amount! ? true : false
        })
        .then(() => {
           toast.success("Budget Edited Successfully")
           dispatch({type: 'UPDATE_BUDGET', payload: budget!})
           closeEdit()
        })
        .catch((err) => toast.error(getError(err as ApiError)))
    }

    const handleDelete = () => {
        axios.delete(`http://localhost:4000/budgets/deleteBudget/${user._id}/${budget._id}`)
        .then(() => {
          toast("Budget Deleted Successfully!")
          dispatch({type: 'DELETE_BUDGET', payload: budget!._id!})
          closeEdit()
        })
        .catch((err) => getError(err as ApiError));
    }

    return (
        <Modal
            open={edit}
            onClose={closeEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form onSubmit={handleEdit} className="mt-40 text-white container flex flex-col mx-auto space-y-12">
                <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
                <div className="space-y-2 col-span-full lg:col-span-1">
                    <p className="font-medium">Edit {name} Budget</p>
                    <p className="text-xs">Modify Your Budget Details</p>
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
                            <input id="yes" type="radio" name="recurring" onChange={(e) => setRecurring(dictionary[e.target.value])} value="true" checked={recurring === true} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="yes" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                        </div>
                        <div className="flex items-center">
                            <input id="no" type="radio" name="recurring" onChange={(e) => setRecurring(dictionary[e.target.value])} value="false" checked={recurring === false} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="no" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button type="submit" style={{"width": "90%"}} className="px-4 py-2 border rounded-md dark:border-gray-100">Save</button>
                    <button onClick={handleDelete} style={{"width": "90%"}} className="px-4 py-2 border rounded-md bg-violet-600 dark:border-gray-100">Delete</button>
                </div>
                </fieldset>
            </form>  
        </Modal>
    )
}
