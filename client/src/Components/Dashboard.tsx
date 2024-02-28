import Card from "./dashboard/Card";
import IncomeHistory from "./dashboard/IncomeHistory";
import Plot from "./dashboard/chart/Plot";

const cardsData = [
  { percent: "25%", name: "Total Revenue", money: 100, color: "bg-violet-200", text: "text-violet-600" },
  { percent: "50%", name: "Total Expense", money: 200, color: "bg-pink-100", text: "text-pink-600" },
  { percent: "75%", name: "Total Income", money: 300, color: "bg-green-200", text: "text-green-600" }
];

export default function Dashboard() {
  return (
    <section className="p-6 dark:bg-gray-900 dark:text-gray-50">
    <div id="dashboard" className="grid grid-cols-4">
      <div className="bg-white-200 col-span-3">
        <Plot/>
        <div className="gap-4 p-4 flex grid grid-cols-3">
          {cardsData.map((card, key) => {
            return (
              <Card 
                key={key} 
                percent={card.percent} 
                name={card.name} 
                money={card.money} 
                color={card.color}
                text={card.text}
              />
            )
          })}
        </div>
        <IncomeHistory/>
      </div>
      <div className="bg-blue-200 col-span-1">2</div>
    </div>
    </section>
  );
}
