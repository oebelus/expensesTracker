export default function IncomeHistory() {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Income History</h1>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Income</th>
                <th className="px-4 py-2 border text-center">Type</th>
                <th className="px-4 py-2 border text-center">Amount</th>
                <th className="px-4 py-2 border text-center">Date</th>
                <th className="px-4 py-2 border text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-center">Monthly Salary</td>
                <td className="px-4 py-2 border text-center">Salary</td>
                <td className="px-4 py-2 border text-center">$3000</td>
                <td className="px-4 py-2 border text-center">2024-02-28</td>
                <td className="px-4 py-2 border text-center">Received</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  