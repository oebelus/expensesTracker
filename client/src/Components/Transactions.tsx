import axios from "axios";
import { useEffect, useState } from "react";
import { Transaction } from "../types/Transaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "@mui/material/Modal"
import { getError } from "../../utils";
import { ApiError } from "../types/ApiError";
import { toast } from "react-toastify";

export default function Transactions() {
    const [data, setData] = useState([]);
    const [edit, setEdit] = useState<boolean>(false)
    const [del, setDel] = useState<boolean>(false)

    const [name, setName] = useState<Transaction['name']>()
    const [amount, setAmount] = useState<Transaction['amount']>("")
    const [category, setCategory] = useState<Transaction['category']>("")
    const [date, setDate] = useState<Transaction['date']>(new Date())
    const [recurring, setRecurring] = useState<Transaction['recurring']>(false)
    const [txId, setTxId] = useState("")

    const [filteredCategory, setFilteredCategory] = useState("")
    const [filteredData, setFilteredData] = useState([])
    
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (filteredCategory !== "") {
            axios.get(`http://localhost:4000/transactions/${userId}/${filteredCategory}`)
            .then((response) => {
                console.log(response);
                setFilteredData(response.data);
            });
        } 
        else {
            axios.get(`http://localhost:4000/transactions/${userId}`)
            .then((response) => {
                setData(response.data);
            });
        }
    }, [userId, filteredCategory]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value
        const parseDate = new Date(selectedDate)
        setDate(parseDate)
    }

    const dictionary: Record<string, boolean> = {
        "yes": true,
        "no": false
    }
    
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

    const handleEdit = (selectedTransaction: Transaction) => {
        setName(selectedTransaction.name);
        setAmount(selectedTransaction.amount);
        setCategory(selectedTransaction.category);
        setDate(selectedTransaction.date);
        setRecurring(selectedTransaction.recurring);
        setTxId(selectedTransaction._id); 
        setEdit(true)
    }

    const handleDelete = (selectedTransaction: Transaction) => {
        setDel(true)
        setTxId(selectedTransaction._id)
    }

    const deleteTx = async () => {
        try {
            await axios.delete(`http://localhost:4000/transactions/deleteTransaction/${userId}/${txId}`)
            setDel(false)
            axios.get(`http://localhost:4000/transactions/${userId}`)
                .then((response) => { setData(response.data); }
            );
        } catch (err) { console.log(getError(err as ApiError)) }
        
    }

    const closeEdit = () => {
        setEdit(false)
    }

    const closeDel = () => {
        setDel(false)
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:4000/transactions/editTransaction/${userId}/${txId}`, {
                name,
                amount,
                category,
                date,
                recurring
            });
            setEdit(false)
            axios.get(`http://localhost:4000/transactions/${userId}`)
                .then((response) => { setData(response.data); }
            );
            toast.success("Transaction Edited Successfully")
        } catch (err) {
            console.log(getError(err as ApiError));
        }
    }

    function txArray(transactions: Transaction[]): string[] {
        const filtered: string[] = [];
        for (const i of transactions) {
            if (!filtered.includes(i.category)) filtered.push(i.category)
        }
        return filtered
    }
    
    return (
        <div>
            <Modal
                open={edit}
                onClose={closeEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal-overlay">
                    <div className="modal mt-10">
                        <form onSubmit={handleSubmit} className="text-white container flex flex-col mx-auto space-y-12">
                            <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
                                <div className="space-y-2 col-span-full lg:col-span-1">
                                    <p className="font-medium">Edit Transaction</p>
                                    <p className="text-xs">Provide Your Transaction details</p>
                                </div>
                                <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
                                    <div className="col-span-full sm:col-span-3">
                                        <label htmlFor="firstname" className="font-medium text-sm mb-2">Name</label>
                                        <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder="Name" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" />
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label htmlFor="transaction" className="text-sm mb-2">Amount</label>
                                        <input value={amount} onChange={(e) => setAmount(e.target.value)} id="amount" type="number" placeholder="Amount" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label htmlFor="category" className="text-sm mb-2">Category</label>
                                        <input value={category} onChange={(e) => setCategory(e.target.value)} id="category" type="text" placeholder="Category" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label htmlFor="date" className="text-sm mb-2">Date</label>
                                        <input onChange={handleDateChange} id="date" type="date" placeholder="Date" className="w-full rounded-md focus:ring focus:ri focus:ri dark:border-gray-700 dark:text-gray-900" required/>
                                    </div>
                                    <div className="col-span-full sm:col-span-2">
                                        <label htmlFor="state" className="text-sm block mb-2">Is it recurring?</label>
                                        <div className="flex">
                                            <div className="flex items-center mr-4">
                                                <input id="default-radio-1" type="radio" onChange={(e) => setRecurring(dictionary[e.target.value])} value="yes" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
                                            </div>
                                        <div className="flex items-center">
                                            <input checked id="default-radio-2" type="radio" onChange={(e) => setRecurring(dictionary[e.target.value])} value="no" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 border rounded-md dark:border-gray-100">Edit Transaction</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </Modal>

            <Modal
                open={del}
                onClose={closeDel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100">
                        <h2 className="text-xl font-semibold leading-tight tracking-tight text-center">Delete Transaction</h2>
                        <p className="flex-1 text-center dark:text-gray-400">Are you sure that you want to delete this transaction?
                            <a href="#" rel="noopener noreferrer" className="font-semibold dark:text-violet-400">Learn more</a>
                        </p>
                        <div className="flex justify-center gap-3 mt-6 sm:mt-8 sm:flex-row">
                            <button onClick={closeDel} className="px-6 py-2 rounded-sm">Cancel</button>
                            <button onClick={deleteTx} className="px-6 py-2 rounded-sm shadow-sm dark:bg-violet-400 dark:text-gray-900">Confirm</button>
                        </div>
                    </div>
                </div>
            </Modal>

            
            <div className="container p-2 mx-auto sm:p-4 dark:text-gray-100">
                <h2 className="mb-4 text-2xl font-semibold leadi">My Transactions</h2>
                <div className="mt-6 md:flex md:items-center md:justify-between mb-6">
                    <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                        <button onClick={() => setFilteredCategory("")} style={{"width": "50%"}} className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                            View all
                        </button>

                        <select style={{"cursor": "pointer", "width": "60%"}} className="px-5 dark:bg-gray-800 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-900">
                            <option value="category">Category</option>
                            {
                                txArray(data).map((tx: string, key) => (
                                    <option onClick={() => setFilteredCategory(tx)} key={key} value={tx}>{tx}</option>
                                ))
                            }
                        </select>

                        <select style={{"cursor": "pointer", "width": "70%"}} className="px-5 py-2 text-xs font-medium text-gray-600 dark:bg-gray-800 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-900">
                            <option value="price">Price</option>
                            <option value="low_to_high">Low to High</option>
                            <option value="high_to_low">High to Low</option>
                        </select>
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
                        {filteredCategory ? 
                        filteredData.map((el: Transaction, key: number) => (
                            <tr key={key} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{format(new Date(el.date))}</p>
                                    <p className="dark:text-gray-400 text-center">{day(new Date(el.date))}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.name}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.amount}$</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.category}</p>
                                </td>
                                <td className="p-3 text-right" style={{ width: '20%' }}>
                                    <p className="text-center">{el.recurring.toString()}</p>
                                </td>
                                <td className="p-3 dark:bg-gray-800">
                                    <button onClick={() => handleEdit(el)}><FontAwesomeIcon className="fa-thin mb-2" icon={faPen} /></button>
                                    <button onClick={() => handleDelete(el)}><FontAwesomeIcon className="fa-thin" icon={faTrash} /></button>
                                </td>
                            </tr>
                        )) : 
                        data.map((el: Transaction, key: number) => (
                            <tr key={key} className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{format(new Date(el.date))}</p>
                                    <p className="dark:text-gray-400 text-center">{day(new Date(el.date))}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.name}</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.amount}$</p>
                                </td>
                                <td className="p-3" style={{ width: '20%' }}>
                                    <p className="text-center">{el.category}</p>
                                </td>
                                <td className="p-3 text-right" style={{ width: '20%' }}>
                                    <p className="text-center">{el.recurring.toString()}</p>
                                </td>
                                <td className="p-3 dark:bg-gray-800">
                                    <button onClick={() => handleEdit(el)}><FontAwesomeIcon className="fa-thin mb-2" icon={faPen} /></button>
                                    <button onClick={() => handleDelete(el)}><FontAwesomeIcon className="fa-thin" icon={faTrash} /></button>
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
