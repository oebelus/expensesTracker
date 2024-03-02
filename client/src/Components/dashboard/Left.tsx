import { MonthlyData } from '../../types/MonthlyData'
import Card from './Card'
import Plot from './chart/Plot'

interface LeftProps {
    firstName: string,
    monthlyData: MonthlyData
    budget: number,
    expense: number 
    income: number
}

export default function Left({firstName, monthlyData, budget, expense, income}: LeftProps) {
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
        <div className="mt-20 flex justify-between md:w-[65%] bg-gray-300 min-h-[45%]">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard, {firstName}</h1>
            <Plot monthlyData={monthlyData} />
            <div className="mt-20 flex justify-between md:w-[65%] bg-gray-300 min-h-[45%]">
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
  )
}
