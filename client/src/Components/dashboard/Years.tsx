interface YearsProps {
    years: number[],
    setClickedYear: (year: number) => void 
}

export default function Years({years, setClickedYear} : YearsProps) {
  return (
    <select onChange={(e) => setClickedYear(parseInt(e.target.value))} id="years" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        {
            years.map((year, key) => {
            return (
                <option key={key} value={`${year}`}>{year}</option>
            )
            })
        }
    </select>
  )
}
