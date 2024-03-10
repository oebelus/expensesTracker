import DashNav from "../Components/DashNav";
import Sidebar from "../Components/Sidebar";
import AddTransaction from "../Components/AddTransaction";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Transactions from "../Components/Transactions";

export default function Tracker() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const toggleAddTransaction = () => {
      setShowAddTransaction(prevState => !prevState);
  };
  return (
        <div className="grid lg:grid-cols-5">
          <Sidebar/>
          <div className="lg:col-span-4 w-full">
            <DashNav />
            <section className="p-6 h-full dark:bg-gray-800 dark:text-gray-50">
              <div className="head">
                <h1 className="text-3xl font-bold mb-4">My Wallet</h1>
                <button className="p-6" onClick={toggleAddTransaction}><FontAwesomeIcon icon={faPlus}/> Add a Transaction</button>
                {showAddTransaction && <AddTransaction />}
                </div>
                <Transactions/>
            </section>
          </div>
        </div>
  )
}
