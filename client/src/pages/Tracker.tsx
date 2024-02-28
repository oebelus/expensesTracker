import DashNav from "../Components/DashNav";
import Dashboard from "../Components/Dashboard";
import Sidebar from "../Components/Sidebar";

export default function Tracker() {
  return (
    <div>
        <div className="flex">
          <Sidebar/>
          <div className="w-full">
            <DashNav />
            <Dashboard/>
          </div>
        </div>
    </div>
  )
}
