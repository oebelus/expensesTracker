import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { Transaction } from "../types/Transaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Modal from "@mui/material/Modal"
import { day, format, getError } from "../../utils";
import { ApiError } from "../types/ApiError";
import { toast } from "react-toastify";
import { initialState, reducer } from "../context";
import { Budget } from "../types/Budget";

export default function Transactions() {
    const [edit, setEdit] = useState<boolean>(false)
    const [del, setDel] = useState<boolean>(false)

    const [name, setName] = useState<Transaction['name']>()
    const [amount, setAmount] = useState<Transaction['amount']>("")
    const [category, setCategory] = useState<Transaction['category']>("")
    const [date, setDate] = useState<Transaction['date']>(new Date())
    const [recurring, setRecurring] = useState<Transaction['recurring']>(false)
    const [txType, setTxType] = useState<Transaction['txType']>("expense")
    const [txId, setTxId] = useState("")
    const [tx, setTx] = useState<Transaction>()

    const [budgetId, setBudgetId] = useState<Budget["_id"]>("")

    const recurringDictionary: Record<string, IconDefinition> = {
        "true": faCheck,
        "false": faXmark
    }

    const [filteredCategory, setFilteredCategory] = useState("")
    const [filteredData, setFilteredData] = useState<Transaction[]>([])

    const minDate = new Date(new Date().setDate(1))
    minDate.setHours(1, 0, 0, 0)

    const [min, setMin] = useState<Date>(minDate)
    const [max, setMax] = useState<Date>(new Date())

    const [prompt, setPrompt] = useState<Transaction['name']>("")
    
    const [state, dispatch] = useReducer(reducer, initialState)
    const user = state.user
    const transactions = state.transactions
    const budgets = state.budgets

    useEffect(() => {
        axios.get(`http://localhost:4000/transactions/${user._id}`)
            .then((response) => {
                dispatch({type: 'FETCH_TX', payload: response.data})
            })
            .catch((err) => {console.log(err)})

        let filteredTransactions: Transaction[] = transactions
        if (min && max) {
            filteredTransactions = transactions.filter((transaction) => {
                const minDate = new Date(min)
                const maxDate = new Date(max)
                const transactionDate = new Date((new Date(transaction.date)).toISOString().substr(0, 10))
                return transactionDate >= minDate && new Date(transactionDate) <= maxDate
            })
        }
        if (filteredCategory !== "") {
            filteredTransactions = filteredTransactions.filter((transaction) => {
                return transaction.category === filteredCategory
            })
        }

        if (prompt !== "") {
            filteredTransactions = filteredTransactions.filter((transaction) => {
                return transaction.name!.toLowerCase().includes(prompt!.toLowerCase())
            })
        }
        setFilteredData(filteredTransactions)
    }, [min, max, filteredCategory, prompt, user._id, transactions]);
    

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value
        const parseDate = new Date(selectedDate)
        setDate(parseDate)
    }

    const dictionary: Record<string, boolean> = {
        "yes": true,
        "no": false
    }  

    const handleEdit = (selectedTransaction: Transaction) => {
        setTx(selectedTransaction)
        setName(selectedTransaction.name);
        setAmount(selectedTransaction.amount);
        setCategory(selectedTransaction.category);
        setDate(selectedTransaction.date);
        setRecurring(selectedTransaction.recurring);
        setTxId(selectedTransaction._id); 
        setEdit(true)
    }

    useEffect(() => {
        axios.get(`http://localhost:4000/budgets/${user._id}`).then(
          (response) => {
            dispatch({type:'FETCH_BUDGET', payload: response.data})
        }
        )
      }, [budgets, user])

    const handleDelete = (selectedTransaction: Transaction) => {
        setDel(true)
        setTxId(selectedTransaction._id)
        setCategory(selectedTransaction.category)
        setAmount(selectedTransaction.amount)
    }

    const deleteTx = async () => {
        try {
            await axios.delete(`http://localhost:4000/transactions/deleteTransaction/${user._id}/${txId}`)
            dispatch({type: "DELETE_TX", payload: txId})
            const length = budgets.length
            for (let i = 0; i < length; i++) {
                if (budgets[i].name.toLowerCase() === category.toLowerCase()) {
                  setBudgetId(budgets[i]._id)
                  const remaining = budgets[i].remaining + Math.abs(parseFloat(amount)) 
                  
                  axios.put(`http://localhost:4000/budgets/editBudget/${user._id}/${budgetId}`, {
                    remaining: remaining,
                    amount: budgets[i].amount,
                    name: budgets[i].name,
                    recurring: budgets[i].recurring,
                    isFull: remaining <= budgets[i].amount ? true : false
                  })
                  .then(() =>{
                    dispatch({type: 'UPDATE_BUDGET', payload: budgets.find(budget => budget._id === budgetId)!})
                    toast.success('Budget Updated Successfully!')
                  })
                  .catch((err) => console.log(getError(err as ApiError)))
                }
            }
            setDel(false)
        } catch(err) {
            console.log(getError(err as ApiError))
        }
        
    }

    const closeEdit = () => {
        setEdit(false)
    }

    const closeDel = () => {
        setDel(false)
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:4000/transactions/editTransaction/${user._id}/${txId}`, {
                name,
                amount,
                category,
                date,
                recurring,
                txType
            });
            setEdit(false)
            dispatch({type: "UPDATE_TX", payload: tx!})
            toast.success("Transaction Edited Successfully")
        } catch (err) {
            console.log(getError(err as ApiError));
        }
    }

    function txArray(transactions: Transaction[]): string[] {
        const filtered: string[] = [];
        for (const i of transactions) {
            if (!filtered.includes(i.category)) filtered.push(i.category)
        }
        return filtered
    }

    function viewAll() {
        setFilteredCategory("")
        setPrompt("")
        
        setMin(minDate)
        setMax(new Date())
    }
    
    return (
        <div>
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
                                        <input value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" type="number" placeholder="Amount" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label htmlFor="category" className="text-sm mb-2">Category</label>
                                        <input value={category} onChange={(e) => setCategory(e.target.value)} id="category" type="text" placeholder="Category" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label htmlFor="date" className="text-sm mb-2">Date</label>
                                        <input onChange={handleDateChange} id="date" type="date" placeholder="Date" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
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
                                <button type="submit" className="px-4 py-2 border rounded-md dark:border-gray-100">Edit Transaction</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </Modal>

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

            
            <div className="container p-2 mx-auto sm:p-4 dark:text-gray-100">
                <h2 className="mb-4 text-2xl font-semibold leadi">My Transactions</h2>
                <div className="mt-6 md:relative md:left-0 lg:flex lg:flex-row sm:flex-col sm:gap-4 md:flex-col md:gap-6 md:flex md:items-center md:justify-between">
                    <div style={{"width": "80%"}} className=" sm:w-90 inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                        <button onClick={viewAll} style={{"width": "40%"}} className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                            View all
                        </button>

                        <select style={{"cursor": "pointer", "width": "60%"}} className="px-5 dark:bg-gray-800 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-900">
                            <option value="category">Category</option>
                            {
                                txArray(transactions).map((tx: string, key) => (
                                    <option onClick={() => setFilteredCategory(tx)} key={key} value={tx}>{tx}</option>
                                ))
                            }
                        </select>
                    </div>
                       
                    <div style={{"width": "35%"}} className="lg:flex mt-5 lg:mt-0 items-center relative lg:right-3">
                        <div className="relative">
                            <input name="start" value={min ? min.toISOString().substr(0, 10) : ""} onChange={(e) => setMin(new Date(e.target.value))} type="date" className="px-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start"/>
                        </div>
                        <span className="mx-4 text-gray-500">to</span>
                        <div className="relative">
                            <input name="end" value={max ? max.toISOString().substr(0, 10) : ""} onChange={(e) => setMax(new Date(e.target.value))} type="date" className="px-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-4 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end"/>
                        </div>
                    </div>
                    <div className="relative flex items-center mt-4 md:mt-0 w-[50%]">
                        <span className="absolute">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </span>

                        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} type="text" placeholder="Search" className="block py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-70 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
                    </div>
                </div>
                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full text-xs">
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                        </colgroup>
                        <thead className="dark:bg-gray-700">
                            <tr className="text-left">
                                <th className="p-3 text-center">Date</th>
                                <th className="p-3 text-center">Name</th>
                                <th className="p-3 text-center">Amount</th>
                                <th className="p-3 text-center">Category</th>
                                <th className="p-3 text-center">Recurrence</th>
                            </tr>
                        </thead>
                        <tbody>
                        {(min || max || prompt !== "" || filteredCategory !== "") ? 
                        filteredData.map((el: Transaction, key: number) => (
                            <tr key={key} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{format(new Date(el.date))}</p>
                                    <p className="dark:text-gray-400 text-center">{day(new Date(el.date))}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.name}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{parseFloat(el.amount) > 0 ? `+${el.amount}` : el.amount} {state.currency}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.category}</p>
                                </td>
                                <td className="p-3 text-right" style={{ width: '20%' }}>
                                    <p className="text-center"><FontAwesomeIcon icon={recurringDictionary[el.recurring.toString()]}/></p>
                                </td>
                                <td className="p-3 dark:bg-gray-800">
                                    <button onClick={() => handleEdit(el)}><FontAwesomeIcon className="fa-thin mb-2" icon={faPen} /></button>
                                    <button onClick={() => handleDelete(el)}><FontAwesomeIcon className="fa-thin" icon={faTrash} /></button>
                                </td>
                            </tr>
                        )) : 
                        transactions.map((el: Transaction, key: number) => (
                            <tr key={key} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{format(new Date(el.date))}</p>
                                    <p className="dark:text-gray-400 text-center">{day(new Date(el.date))}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.name}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.amount}$</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.category}</p>
                                </td>
                                <td className="p-3 text-right" style={{ width: '20%' }}>
                                    <p className="text-center">{el.recurring.toString()}</p>
                                </td>
                                <td className="p-3 dark:bg-gray-800">
                                    <button onClick={() => handleEdit(el)}><FontAwesomeIcon className="fa-thin mb-2" icon={faPen} /></button>
                                    <button onClick={() => handleDelete(el)}><FontAwesomeIcon className="fa-thin" icon={faTrash} /></button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}