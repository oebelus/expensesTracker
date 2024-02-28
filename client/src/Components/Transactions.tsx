import axios from "axios";
import { useEffect, useState } from "react";
import { Transaction } from "../types/Transaction";

export default function Transactions() {
    const [data, setData] = useState([]);
    
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        axios.get(`http://localhost:4000/transactions/${userId}`)
            .then((response) => {
                setData(response.data);
            });
    }, [userId]); // Add userId to the dependency array

    function day(date: Date): string {
        const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }   
    
    function format(date: Date): string {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const arr = date.toDateString().split(" ").splice(1, 4);
        const day = arr[1];
        arr[0] = day;
        arr[1] = months[date.getMonth()];
        return arr.join(" ");
    }

    return (
        <div>
            <div className="container p-2 mx-auto sm:p-4 dark:text-gray-100">
                <h2 className="mb-4 text-2xl font-semibold leadi">My Transactions</h2>
                <div className="mt-6 md:flex md:items-center md:justify-between mb-6">
                    <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                        <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                            View all
                        </button>

                        <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                            Category 
                        </button>

                        <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                            Price
                        </button>
                    </div>

                    <div className="relative flex items-center mt-4 md:mt-0">
                        <span className="absolute">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </span>

                        <input type="text" placeholder="Search" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
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
                        {data.map((el: Transaction, key: number) => (
                            <tr key={key} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                <td className="p-3">
                                    <p className="text-center">{format(new Date(el.date))}</p>
                                    <p className="dark:text-gray-400 text-center">{day(new Date(el.date))}</p>
                                </td>
                                <td className="p-3">
                                    <p className="text-center">{el.name}</p>
                                </td>
                                <td className="p-3">
                                    <p className="text-center">{el.amount}</p>
                                </td>
                                <td className="p-3">
                                    <p className="text-center">{el.category}</p>
                                </td>
                                <td className="p-3 text-right">
                                    <p className="text-center">{el.recurring.toString()}</p>
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
