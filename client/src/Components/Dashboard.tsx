import { useEffect, useReducer, useState } from "react";
import Card from "./dashboard/Card";
import Plot from "./dashboard/chart/Plot";
import axios from "axios";
import { Transaction } from "../types/Transaction";
import TxHistory from "./dashboard/TxHistory";                                                                                                                             
import UpcomingPayments from "./dashboard/UpcomingPayments";
import { initialState, reducer } from "../context";
import { getError } from "../../utils";
import { ApiError } from "../types/ApiError";
import { MonthlyData } from "../types/MonthlyData";

export default function Dashboard() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const user = state.user
  const transactions = state.transactions

  const monthlyTotals: MonthlyData = {
    income: new Array(12).fill(0),
    expense: new Array(12).fill(0),
    budget: new Array(12).fill(0),
  };

  const [history, setHistory] = useState<Transaction[]>([])

  const year = "2023"

  useEffect(() => {
    axios.get(`http://localhost:4000/transactions/${user._id}`)
    .then(response => {
            dispatch({type: 'FETCH_TX', payload: response.data})
        })
    .catch((error) => console.log(getError(error as ApiError)))
  }, [user._id])

  useEffect(() => {
    transactions.filter((transaction: Transaction) => {
      return new Date(transaction.date).getFullYear() === new Date(year).getFullYear() 
    })

    const transactionsHistory = transactions.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const length = transactionsHistory.length
    const max = length < 4 ? length : 4

    setHistory(transactionsHistory.splice(0, max))

  }, [])

  transactions.forEach((transaction: Transaction) => {
    const monthIndex = new Date(transaction.date).getMonth();
    const transactionAmount = parseInt(transaction.amount)

    if (transactionAmount > 0) {
      monthlyTotals.income[monthIndex] += parseInt(transaction.amount);
    } else if (transactionAmount < 0) {
      monthlyTotals.expense[monthIndex] += Math.abs(transactionAmount); 
    } 
    monthlyTotals.budget[monthIndex] = monthlyTotals.income[monthIndex] - monthlyTotals.expense[monthIndex]
  });

  const budget = monthlyTotals.budget.reduce((a, b) => {return a + b})
  const expense = monthlyTotals.expense.reduce((a, b) => {return a + b})
  const income: number = monthlyTotals.income.reduce((a, b) => {return a + b})

  const total = budget + expense + income

  const pBudget = ((budget/total)*100).toFixed(2)
  const pExpense = ((expense/total)*100).toFixed(2)
  const pIncome = ((income/total)*100).toFixed(2)

  const cardsData = [
    { percent: `${pBudget}%`, name: "Available Balance", money: budget, color: "bg-gray-700", border: "border-violet-200", shadow: "bg-violet-600", text: "text-violet-900" },
    { percent: `${pExpense}%`, name: "Total Expense", money: expense, color: "bg-gray-700", border: "border-pink-200", shadow: "bg-pink-600", text: "text-pink-900" },
    { percent: `${pIncome}%`, name: "Total Income", money: income, color: "bg-gray-700", border: "border-green-200", shadow: "bg-green-600", text: "text-green-900" }
  ];
  
  return (
    <section className="p-6 dark:bg-gray-900 dark:text-gray-50 overflow-y-hidden">
      <h1 className="lg:text-2xl font-bold">Welcome to your Dashboard, {user.firstName}</h1>
      <div className="flex flex-col shadow-md w-90 m-6 sm:flex-row gap-4">
        {cardsData.map((card, key) => {
          return (
            <Card 
              key={key} 
              percent={card.percent} 
              name={card.name} 
              money={card.money} 
              color={card.color}
              text={card.text}
              shadow={card.shadow}
              border={card.border}
            />
          )
        })}
      </div>
      <div id="dashboard" className="grid gap-4 lg:grid-cols-4 sm:col-span-3">
        <div className="items-center bg-gray-800 rounded-lg sm:col-span-1 lg:col-span-2 md:col-span-2 flex-col">
            <Plot monthlyData={monthlyTotals} />
        </div>
        <div className="rid flex justify-center lg:gap-8 md:gap-10 sm:gap-16 sm:flex-row md:flex-row lg:flex-row rounded-lg p-4 bg-gray-800 sm:col-span-2 lg:col-span-2 md:col-span-2 flex-col">    
          <TxHistory history={history}/>
          <UpcomingPayments />
        </div>
      </div>
    </section>
  );
}
