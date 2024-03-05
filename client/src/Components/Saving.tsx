import { faArrowRight, faCar, faHouse, faLaptop, faPills, faPlane } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Budget() {
  const suggested = [
    { name: "Travel", icon: faPlane },
    { name: "Health", icon: faPills },
    { name: "Car", icon: faCar },
    { name: "Home", icon: faHouse },
    { name: "A New PC", icon: faLaptop },
  ]
  return (
    <div className="p-6 dark:bg-gray-800 dark:text-gray-50">
      <h1 className="text-3xl font-bold mb-4">Budget</h1>
      <p className="ml-4 mb-6"><FontAwesomeIcon icon={faArrowRight}/> Set your monthly spending limits</p>
      <h2 className="text-2xl mb-10">Your budgets:</h2>
      <div className="bg-violet-100 border border-violet-400 text-violet-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Holy smokes! </strong>
        <span className="block sm:inline">Nothing to show here.</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        </span>
      </div>
      <div>
        <h2 className="text-2xl mt-10">Suggested Budgets:</h2>
        {
          suggested.map((suggestion, key) => {
            return (
              <div className="flex gap-4 mt-6 p-4 ml-5 border rounded-lg w-[60%]" style={{"cursor": "pointer"}} key={key}>
                <FontAwesomeIcon className="mt-5" icon={suggestion.icon}/>
                <div>
                  <h3>{suggestion.name}</h3>
                  <p>Set a Budget for this category</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
