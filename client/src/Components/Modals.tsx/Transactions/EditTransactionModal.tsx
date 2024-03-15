import { Modal } from "@mui/material";
import { Transaction } from "../../../types/Transaction";
import axios from "axios";
import { useReducer, useState } from "react";
import { initialState, reducer } from "../../../context";
import { toast } from "react-toastify";
import { dictionary, getError } from "../../../../utils";
import { ApiError } from "../../../types/ApiError";
import { Budget } from "../../../types/Budget";

interface EditTransactionModalProps {
    edit: boolean;
    closeEdit: () => void
    transaction: Transaction
    budgets: Budget[]
}

export default function EditTransactionModal({edit, closeEdit, transaction, budgets}: EditTransactionModalProps) {
    const [name, setName] = useState<Transaction['name']>(transaction.name)
    const [amount, setAmount] = useState<Transaction['amount']>(transaction.amount)
    const [category, setCategory] = useState<Transaction['category']>(transaction.category)
    const [date, setDate] = useState<Transaction['date']>(new Date(transaction.date))
    const [recurring, setRecurring] = useState<Transaction['recurring']>(transaction.recurring)
    const [txType, setTxType] = useState<Transaction['txType']>(transaction.txType)

    const [state, dispatch] = useReducer(reducer, initialState)
    const user = state.user 
    
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        for (let i = 0; i < length; i++) {
            console.log(budgets[i].name.toLowerCase() === category.toLowerCase() && (new Date(budgets[i].createdAt)).getMonth() === (new Date().getMonth()))
            if (budgets[i].name.toLowerCase() === category.toLowerCase() && (new Date(budgets[i].createdAt)).getMonth() === (new Date().getMonth())) {
              const remaining = budgets[i].amount - (budgets[i].remaining + amount) 
              axios.put(`http://localhost:4000/budgets/editBudget/${user._id}/${budgets[i]._id}`, {
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
        await axios.put(`http://localhost:4000/transactions/editTransaction/${user._id}/${transaction._id}`, {
                name,
                amount: txType === "expense" ? amount < 0 ? amount : -amount : - amount,
                category,
                date: date.toISOString(),
                recurring,
                txType
        })
        .then(() => { 
            dispatch({type: "UPDATE_TX", payload: transaction!})
            toast.success("Transaction Edited Successfully")
        })
        .catch ((err) => console.log(getError(err as ApiError)))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = new Date(e.target.value);
        if (!isNaN(inputDate.getTime())) {
            setDate(inputDate);
        } else {
            setDate(new Date());
        }
    };

    return (
        <Modal
            open={edit}
            onClose={closeEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="modal-overlay">
                <div className="modal mt-10">
                    <form onSubmit={handleSubmit} className="text-white container flex flex-col mx-auto space-y-12">
                        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
                            <div className="space-y-2 col-span-full lg:col-span-1">
                                <p className="font-medium">Edit Transaction</p>
                                <p className="text-xs">Provide Your Transaction details</p>
                            </div>
                            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
                                <div className="col-span-full sm:col-span-3">
                                    <label htmlFor="firstname" className="font-medium text-sm mb-2">Name</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder="Name" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" />
                                </div>
                                <div className="col-span-full sm:col-span-3">
                                    <label htmlFor="transaction" className="text-sm mb-2">Amount</label>
                                    <input value={Math.abs(amount)} onChange={(e) => setAmount(parseInt(e.target.value))} id="amount" type="number" placeholder="Amount" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
                                </div>
                                <div className="col-span-full sm:col-span-3">
                                    <label htmlFor="category" className="text-sm mb-2">Category</label>
                                    <input value={category} onChange={(e) => setCategory(e.target.value)} id="category" type="text" placeholder="Category" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
                                </div>
                                <div className="col-span-full sm:col-span-3">
                                    <label htmlFor="date" className="text-sm mb-2">Date</label>
                                    <input onChange={handleDateChange} id="date" type="date" placeholder="Date" value={(new Date(date)).toISOString().slice(0, 10)}  className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
                                </div>
                                <div className="col-span-full sm:col-span-2">
                                <label htmlFor="state" className="text-sm block mb-2">Is it recurring?</label>
                                    <div className="flex">
                                        <div className="flex items-center mr-4">
                                            <input id="yes" type="radio" name="recurring" onChange={(e) => setRecurring(dictionary[e.target.value])} value="yes" checked={recurring === true} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="yes" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="no" type="radio" name="recurring" onChange={(e) => setRecurring(dictionary[e.target.value])} value="no" checked={recurring === false} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="no" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-full sm:col-span-2">
                                    <label htmlFor="state" className="text-sm block mb-2">Transaction Type</label>
                                        <div className="flex">
                                            <div className="flex items-center mr-4">
                                                <input id="expense" type="radio" name="txType" onChange={(e) => setTxType(e.target.value)} value="expense" checked={txType === "expense"} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label htmlFor="expense" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Expense</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input id="income" type="radio" name="txType" onChange={(e) => setTxType(e.target.value)} value="income" checked={txType === "income"} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label htmlFor="income" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Income</label>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <button type="submit" className="px-4 py-2 border rounded-md dark:border-gray-100">Edit Transaction</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </Modal>
    )
}
