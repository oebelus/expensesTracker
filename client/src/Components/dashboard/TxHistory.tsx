import { format } from "../../../utils";
import { Transaction } from "../../types/Transaction";

export default function TxHistory({history}: {history: Transaction[]}) {
    return (
      <div>
        <h1 className="text-xl font-bold">Recent Transactions</h1>
          {
            history.map((transaction, key) => ( new Date(transaction.date).getMonth() === new Date().getMonth() && 
              <div key={key} className="max-w-md p-2 sm:flex sm:space-x-2 dark:bg-gray-900 dark:text-gray-100">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h2 className="font-semibold">{transaction.name}</h2>
                    <div className="flex gap-10">
                      <span className="text-sm dark:text-gray-400">{format(new Date(transaction.date))}</span>
                      <span className="text-sm dark:text-gray-400">{transaction.amount}$</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
    );
  }
  