import { Transaction } from "../types/Transaction";

interface TransactionsFilterProps {
    viewAll: () => void
    setFilteredCategory: (category: string) => void
    setPrompt: (prompt: string) => void
    setMax: (max: Date) => void
    setMin: (min: Date) => void
    transactions: Transaction[]
    min: Date
    max: Date
    prompt: string
}

export default function TransactionsFilter({viewAll, setFilteredCategory, setPrompt, setMax, setMin, transactions, min, max, prompt}: TransactionsFilterProps) {

    function txArray(transactions: Transaction[]): string[] {
        const filtered: string[] = [];
        for (const i of transactions) {
            if (!filtered.includes(i.category)) filtered.push(i.category)
        }
        return filtered
    }
    
    return (
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
    )
}
