import DashNav from "../Components/DashNav";
import Sidebar from "../Components/Sidebar";

export default function Dashboard() {
  return (
    <div>
        <div className="flex">
        <Sidebar/>
        <div className="w-full">
          <DashNav />
        </div>
        </div>
    </div>
  )
}
