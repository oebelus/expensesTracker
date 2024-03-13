import { Helmet } from "react-helmet";
import Budgeting from "../Components/Budgeting";
import DashNav from "../Components/DashNav";
import Sidebar from "../Components/Sidebar";

export default function BudgetingPage() {
  return (
    <div className="grid lg:grid-cols-5">
      <Helmet>
        <title>Budgeting</title>
      </Helmet>
        <Sidebar/>
        <div className="lg:col-span-4 w-full">
            <DashNav />
            <Budgeting/>
        </div>
    </div>
  )
}
