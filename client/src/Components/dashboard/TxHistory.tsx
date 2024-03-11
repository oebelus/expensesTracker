import { useEffect, useReducer, useState } from "react";
import { format, getError } from "../../../utils";
import { Transaction } from "../../types/Transaction";
import axios from "axios";
import { initialState, reducer } from "../../context";
import { ApiError } from "../../types/ApiError";

export default function TxHistory() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const user = state.user
  const transactions = state.transactions

  const [history, setHistory] = useState<Transaction[]>([])
  
  useEffect(() => {
    axios.get(`http://localhost:4000/transactions/${user._id}`)
    .then((response) => {
      dispatch({type: 'FETCH_TX', payload: response.data})
      transactions.filter((transaction: Transaction) => {
        return new Date(transaction.date).getFullYear() === new Date().getFullYear() 
      })   
      const transactionsHistory = transactions.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      const length = transactionsHistory.length
      const max = length < 4 ? length : 4

      setHistory(transactionsHistory.splice(0, max)) 
    })
    
    .catch((error) => console.log(getError(error as ApiError)))
  }, [transactions, user._id])

  return (
    <div>
      <h1 className="text-xl font-bold text-center mt-4">Recent Transactions</h1>
        {
          history.map((transaction, key) => ( new Date(transaction.date).getMonth() === new Date().getMonth() && 
            <div key={key} className="max-w-md p-2 sm:flex sm:space-x-2 dark:bg-gray-800 dark:text-gray-100">
              <div className="flex flex-col space-y-4">
                <div>
                  <h2 className="font-semibold">{transaction.name}</h2>
                  <div className="flex gap-10">
                    <span className="text-sm dark:text-gray-400">{format(new Date(transaction.date))}</span>
                    <span className="text-sm dark:text-gray-400">{transaction.amount}$</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
  