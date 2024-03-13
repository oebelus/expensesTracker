import { Helmet } from "react-helmet-async";
import DashNav from "../Components/DashNav";
import Dashboard from "../Components/Dashboard";
import Sidebar from "../Components/Sidebar";

export default function Tracker() {
  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="flex flex-col lg:grid lg:grid-cols-5">
        <Sidebar/>
        <div className="lg:w-full sm:flex-col lg:col-span-4 relative">
          <DashNav />
          <Dashboard/>
        </div>
      </div>
    </div>
  )
}
