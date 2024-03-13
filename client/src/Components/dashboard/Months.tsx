export default function Months({ setMonth }: { setMonth: (month: number) => void }) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return (
        <select onChange={(e) => setMonth(parseInt(e.target.value))} id="months" defaultValue={months[(new Date).getMonth()]} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {
                months.map((month, key) => {
                return (
                    <option key={key} value={`${months.indexOf(month)}`}>{month}</option>
                )
                })
            }
        </select>
    )
}
