import { Modal } from "@mui/material";
import axios from "axios";
import { useReducer } from "react";
import { initialState, reducer } from "../../../context";
import { Transaction } from "../../../types/Transaction";
import { Budget } from "../../../types/Budget";
import { toast } from "react-toastify";
import { getError } from "../../../../utils";
import { ApiError } from "../../../types/ApiError";

interface DeleteTransactionProps {
    del: boolean;
    closeDel: () => void;
    transaction: Transaction
    budgets: Budget[]
}

export default function DeleteTransaction({del, closeDel, transaction, budgets}: DeleteTransactionProps) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const user = state.user

    const deleteTx = async () => {
        try {
            await axios.delete(`http://localhost:4000/transactions/deleteTransaction/${user._id}/${transaction._id}`)
            dispatch({type: "DELETE_TX", payload: transaction._id})
            toast.success("Transaction Deleted Successfully")
            const length = budgets.length
            for (let i = 0; i < length; i++) {
                if (budgets[i].name.toLowerCase() === transaction.category.toLowerCase() && (new Date(budgets[i].createdAt)).getMonth() === (new Date().getMonth())) {
                    const remaining = budgets[i].remaining + Math.abs(transaction.amount) 
                    console.log(budgets[i].amount, budgets[i].remaining, remaining)
                    axios.put(`http://localhost:4000/budgets/editBudget/${user._id}/${budgets[i]._id}`, {
                        remaining: remaining > budgets[i].amount ? budgets[i].amount : remaining,
                        amount: budgets[i].amount,
                        name: budgets[i].name,
                        recurring: budgets[i].recurring,
                        isFull: remaining <= budgets[i].amount ? true : false
                    })
                    .then(() =>{
                        dispatch({type: 'UPDATE_BUDGET', payload: budgets.find(budget => budget._id === budgets[i]._id)!})
                        toast.success('Budget Updated Successfully!')
                        closeDel()
                    })
                    .catch((err) => console.log(getError(err as ApiError)))
                }
            }
        } catch(err) {
            console.log(getError(err as ApiError))
        }
    }
    return (
        <Modal
            open={del}
            onClose={closeDel}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100">
                    <h2 className="text-xl font-semibold leading-tight tracking-tight text-center">Delete Transaction</h2>
                    <p className="flex-1 text-center dark:text-gray-400">Are you sure that you want to delete this transaction?
                    </p>
                    <div className="flex justify-center gap-3 mt-6 sm:mt-8 sm:flex-row">
                        <button onClick={closeDel} className="px-6 py-2 rounded-sm">Cancel</button>
                        <button onClick={deleteTx} className="px-6 py-2 rounded-sm shadow-sm dark:bg-violet-400 dark:text-gray-900">Confirm</button>
                    </div>
                </div>
            </div>
        </Modal>
  )
}
