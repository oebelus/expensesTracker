import { useEffect, useReducer, useState } from "react";
import Card from "./dashboard/Card";
import Plot from "./dashboard/chart/Plot";
import axios from "axios";
import TxHistory from "./dashboard/TxHistory";                                                                                                                             
import UpcomingPayments from "./dashboard/UpcomingPayments";
import { initialState, reducer } from "../context";
import { MonthlyData } from "../types/MonthlyData";

export default function Dashboard() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyData>({
    income: new Array(12).fill(0),
    expense: new Array(12).fill(0),
    budget: new Array(12).fill(0),
  })
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [years, setYears] = useState<number[]>([])
  const last = new Date().getFullYear()

  const [clickedYear, setClickedYear] = useState<number>(new Date().getFullYear())

  const user = state.user
  const transactions = state.transactions

  useEffect(() => {
    axios.get(`http://localhost:4000/transactions/${user._id}`)
      .then((response) => {
          dispatch({type: 'FETCH_TX', payload: response.data})
          setYear(new Date(response.data[0].date).getFullYear())
          setYears(Array.from({length: last- year + 1}, (_, index) => year + index))
          console.log("CLICKED", clickedYear)
      })
      .catch((err) => {console.log(err)})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user._id, clickedYear]);

  useEffect(() => {
    const monthlyTotalsCopy = {
      income: new Array(12).fill(0),
      expense: new Array(12).fill(0),
      budget: new Array(12).fill(0),
    };

    const filterByYear = transactions.filter((transaction) => {
      const transactionYear = new Date(transaction.date).getFullYear() as number
      return transactionYear === clickedYear
    })
    console.log(filterByYear)
    filterByYear.forEach((transaction) => {
      const monthIndex = new Date(transaction.date).getMonth()
      const transactionAmount = parseInt(transaction.amount)

      if (transactionAmount > 0) 
        monthlyTotalsCopy.income[monthIndex] += transactionAmount
      else if (transactionAmount < 0)
        monthlyTotalsCopy.expense[monthIndex] += Math.abs(transactionAmount)
      monthlyTotalsCopy.budget[monthIndex] = monthlyTotalsCopy.income[monthIndex] - monthlyTotalsCopy.expense[monthIndex]
    })
    setMonthlyTotals(monthlyTotalsCopy)
  }, [clickedYear, transactions])

  const budget = monthlyTotals.budget.reduce((a, b) => a + b);
  const expense = monthlyTotals.expense.reduce((a, b) => a + b);
  const income = monthlyTotals.income.reduce((a, b) => a + b);

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
        <div className="w-auto flex flex-col relative items-center bg-gray-800 rounded-lg sm:col-span-1 lg:col-span-2 md:col-span-2">
          <div className='w-[20%] absolute top-2 right-2'>
            <select onChange={(e) => setClickedYear(parseInt(e.target.value))} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {
                  years.map((year, key) => {
                    return (
                      <option key={key} value={`${year}`}>{year}</option>
                    )
                  })
                }
            </select>
          </div>
          <Plot monthlyData={monthlyTotals} />
        </div>
        <div className="rid flex justify-center lg:gap-8 md:gap-10 sm:gap-16 sm:flex-row md:flex-row lg:flex-row rounded-lg p-4 bg-gray-800 sm:col-span-2 lg:col-span-2 md:col-span-2 flex-col">    
          <TxHistory/>
          <UpcomingPayments />
        </div>
      </div>
    </section>
  );
}
