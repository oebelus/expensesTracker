import { useEffect, useState } from "react";
import Card from "./dashboard/Card";
import Plot from "./dashboard/chart/Plot";
import axios from "axios";
import { Transaction } from "../types/Transaction";
import { MonthlyData } from "../types/MonthlyData";
import TxHistory from "./dashboard/TxHistory";
import { getError } from "../../utils";
import { ApiError } from "../types/ApiError";                                                                                                                                 
import UpcomingPayments from "./dashboard/UpcomingPayments";
import TotalBalance from "./dashboard/TotalBalance";

export default function Dashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    income: new Array(12).fill(0),
    expense: new Array(12).fill(0),
    budget: new Array(12).fill(0),
  });

  const [history, setHistory] = useState<Transaction[]>([])
  const [firstName, setFistName] = useState("")
  const [familyName, setFamilyName] = useState("")

  const year = "2023"
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    axios.get(`http://localhost:4000/users/${userId}`)
      .then((response) => {
        setFistName(response.data.firstName)
        setFamilyName(response.data.familyName)
      })
      .catch((err) => getError(err as ApiError))
  })

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    let transactions: Transaction[] = []
    axios.get(`http://localhost:4000/transactions/${userId}`)
        .then(response => {
            transactions = response.data;
            const monthlyTotals = {
                income: new Array(12).fill(0),
                expense: new Array(12).fill(0),
                budget: new Array(12).fill(0),
            };

            transactions.filter((transaction: Transaction) => {
                return new Date(transaction.date).getFullYear() === new Date(year).getFullYear() 
            })

            const transactionsHistory = transactions.sort((a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            setHistory(transactionsHistory)

            transactions.forEach((transaction: Transaction) => {
                const monthIndex = new Date(transaction.date).getMonth();
                const transactionAmount = parseInt(transaction.amount)
                if (transactionAmount > 0) {
                    monthlyTotals.income[monthIndex] += transaction.amount;
                } else if (transactionAmount < 0) {
                    monthlyTotals.expense[monthIndex] += Math.abs(transactionAmount); 
                } 
                monthlyTotals.budget[monthIndex] = monthlyTotals.income[monthIndex] - monthlyTotals.expense[monthIndex]
            });

            setMonthlyData(monthlyTotals);
        })
        .catch(error => console.log(error));
  }, [year]);

  const budget = monthlyData.budget.reduce((a, b) => {return a + b})
  const expense = monthlyData.expense.reduce((a, b) => {return a + b})
  const income: number = monthlyData.income.reduce((a, b) => {return a + b})

  const total = budget + expense + income

  const pBudget = ((budget/total)*100).toFixed(2)
  const pExpense = ((expense/total)*100).toFixed(2)
  const pIncome = ((income/total)*100).toFixed(2)

  const cardsData = [
    { percent: `${pBudget}%`, name: "Total Budget", money: budget, color: "bg-violet-400", border: "border-violet-200", shadow: "bg-violet-600", text: "text-violet-900" },
    { percent: `${pExpense}%`, name: "Total Expense", money: expense, color: "bg-pink-400", border: "border-pink-200", shadow: "bg-pink-600", text: "text-pink-900" },
    { percent: `${pIncome}%`, name: "Total Income", money: income, color: "bg-green-400", border: "border-green-200", shadow: "bg-green-600", text: "text-green-900" }
  ];
  
  return (
    <section className="p-6 dark:bg-gray-900 dark:text-gray-50 overflow-y-hidden">
      <h1 className="lg:text-2xl font-bold">Welcome to your Dashboard, {firstName}</h1>
      <div id="dashboard" className="grid gap-4 lg:grid-cols-4 sm:col-span-3">
        <div className="mt-5 bg-gray-800 rounded-lg col-span-3 lg:col-span-3 flex-col">
            <Plot monthlyData={monthlyData} />
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
        </div>
        <div className="lg:grid lg:grid-rows-2 rounded-lg p-4 bg-gray-800 col-span-3 sm:col-span-3 lg:col-span-1 md:col-span-3 flex-col">
            <TotalBalance  budget={budget} firstName={firstName} familyName={familyName}/>
            <div className="">
              <TxHistory history={history}/>
              <UpcomingPayments />
            </div>
        </div>
      </div>
    </section>
  );
}
