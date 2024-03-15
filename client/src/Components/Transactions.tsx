import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { Transaction } from "../types/Transaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { day, format, recurringDictionary } from "../../utils";
import { initialState, reducer } from "../context";
import DeleteTransaction from "./Modals.tsx/Transactions/DeleteTransaction";
import EditTransactionModal from "./Modals.tsx/Transactions/EditTransactionModal";

export default function Transactions() {
    const [edit, setEdit] = useState<boolean>(false)
    const [del, setDel] = useState<boolean>(false)

    const [tx, setTx] = useState<Transaction>()

    

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
    

    const handleEdit = (selectedTransaction: Transaction) => {
        setTx(selectedTransaction)
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
        setTx(selectedTransaction)
    }

    const closeEdit = () => {
        setEdit(false)
    }

    const closeDel = () => {
        setDel(false)
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
            {edit && tx && <EditTransactionModal edit={edit} closeEdit={closeEdit} transaction={tx} />}
            {tx && <DeleteTransaction del={del} closeDel={closeDel} transaction={tx} budgets={budgets} />}
            
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
                                    <p className="text-center">{el.amount > 0 ? `+${el.amount}` : el.amount} {state.currency}</p>
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
                                <td className="p-3 dark:bg-gray-800 border-none">
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