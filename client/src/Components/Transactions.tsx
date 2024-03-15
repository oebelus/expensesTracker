import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { Transaction } from "../types/Transaction";
import { initialState, reducer } from "../context";
import DeleteTransaction from "./Modals.tsx/Transactions/DeleteTransaction";
import EditTransactionModal from "./Modals.tsx/Transactions/EditTransactionModal";
import TransactionsTable from "./TransactionsTable";
import TransactionsFilter from "./TransactionsFilter";

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

    const handleEdit = (selectedTransaction: Transaction) => {
        setTx(selectedTransaction)
        setEdit(true)
    }

    const closeEdit = () => {
        setEdit(false)
    }

    const closeDel = () => {
        setDel(false)
    }

    function viewAll() {
        setFilteredCategory("")
        setPrompt("")
        setMin(minDate)
        setMax(new Date())
    }
    
    return (
        <div>
            {edit && tx && <EditTransactionModal edit={edit} budgets={budgets} closeEdit={closeEdit} transaction={tx} />}
            {tx && <DeleteTransaction del={del} closeDel={closeDel} transaction={tx} budgets={budgets} />}
            <TransactionsFilter 
                viewAll={viewAll}
                setFilteredCategory={setFilteredCategory}
                setPrompt={setPrompt}
                setMax={setMax}
                setMin={setMin}
                transactions={transactions}
                min={min}
                max={max}
                prompt={prompt}
            />
            <div className="container p-2 mx-auto sm:p-4 dark:text-gray-100">
                <h2 className="mb-4 text-2xl font-semibold leadi">My Transactions</h2>
                
                <TransactionsTable 
                    prompt={prompt}
                    filteredCategory={filteredCategory}
                    min={min}
                    max={max}
                    filteredData={filteredData}
                    transactions={transactions}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
}