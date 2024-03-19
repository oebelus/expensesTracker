import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { day, format, recurringDictionary } from "../utils/utils";
import { Transaction } from "../types/Transaction";
import { useReducer } from "react";
import { initialState, reducer } from "../context";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

interface TransactionsTableProps {
    prompt: string;
    filteredCategory: string;
    min: Date;
    max: Date;
    filteredData: Transaction[];
    transactions: Transaction[];
    handleEdit: (transaction: Transaction) => void;
    handleDelete: (transaction: Transaction) => void
}

export default function TransactionsTable({prompt, filteredCategory, min, max, filteredData, transactions, handleEdit, handleDelete}: TransactionsTableProps) {
    const [state, ] = useReducer(reducer, initialState) 
    
    return (
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
                {(min || max || prompt !== "" || filteredCategory !== "") ? 
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
                            <p className="text-center">{el.amount > 0 ? `+${el.amount}` : el.amount} {state.currency}</p>
                        </td>
                        <td className="p-3" style={{ width: '20%' }}>
                            <p className="text-center">{el.category}</p>
                        </td>
                        <td className="p-3 text-right" style={{ width: '20%' }}>
                            <p className="text-center"><FontAwesomeIcon icon={recurringDictionary[el.recurring.toString()]}/></p>
                        </td>
                        <td className="p-3 dark:bg-gray-800">
                            <button onClick={() => handleEdit(el)}><FontAwesomeIcon className="fa-thin mb-2" icon={faPen} /></button>
                            <button onClick={() => handleDelete(el)}><FontAwesomeIcon className="fa-thin" icon={faTrash} /></button>
                        </td>
                    </tr>
                )) : 
                transactions.map((el: Transaction, key: number) => (
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
                        <td className="p-3 dark:bg-gray-800 border-none">
                            <button onClick={() => handleEdit(el)}><FontAwesomeIcon className="fa-thin mb-2" icon={faPen} /></button>
                            <button onClick={() => handleDelete(el)}><FontAwesomeIcon className="fa-thin" icon={faTrash} /></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
