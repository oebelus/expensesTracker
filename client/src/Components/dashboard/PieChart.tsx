import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Transaction } from '../../types/Transaction';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPieChart } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(ArcElement, Tooltip, Legend);
  
export function PieChart(transactions: {transactions: Transaction[]}) {
  const [categoryArray, setCategoryArray] = useState<Transaction["category"][]>([])
  const [amountArray, setAmountArray] = useState<number[]>([])

 useEffect(() => {
    const categories: Record<Transaction["category"], number> = {};
    transactions["transactions"].forEach((transaction) => {
      const amount = transaction.amount;
      if (amount < 0) {
        if (!categories[transaction.category]) {
          categories[transaction.category] = 0;
        }
        categories[transaction.category] += Math.abs(amount);
      }
    });
    setCategoryArray(Object.keys(categories))
    setAmountArray(Object.values(categories))
  }, [transactions])
  
  const data = {
    labels: categoryArray,
    datasets: [
      {
        label: 'Amount',
        data: amountArray,
        backgroundColor: [
          'rgba(255, 153, 153, 0.2)',
          'rgba(153, 204, 255, 0.2)',
          'rgba(255, 229, 153, 0.2)',
          'rgba(179, 217, 204, 0.2)',
          'rgba(217, 204, 255, 0.2)',
          'rgba(255, 204, 153, 0.2)'          
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    transactions["transactions"].length > 0 ? (
      <div className='items-center w-full lg:h-[400px] md:h-[300px] mt-2 w-content flex flex-col relative mb-4'>
        <Pie
          height={"330px"} 
          width={"200px"}
          data={data} 
        />
      </div>
    ) : (
        <div className="mt-auto bg-gray-900 text-white-700 px-4 py-3" role="alert">
        <FontAwesomeIcon icon={faPieChart}/>
          <p className="font-bold">Pie Chart needs data to render :3</p>
          <p className="text-sm">
            It appears like you still didn't add any transaction this month, add your first one{' '}
            <a className="text-violet-600 hover:text-violet-700 font-bold" href={`${window.location.pathname.replace(window.location.pathname, "wallet")}`}>
              here
            </a>
          </p>
        </div>
    )
  );
}
  