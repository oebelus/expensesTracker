import { Helmet } from "react-helmet-async";
import DashNav from "../Components/DashNav";
import Saving from "../Components/Saving";
import Sidebar from "../Components/Sidebar";

export default function SavingPage() {
  return (
    <div className="grid lg:grid-cols-5">
      <Helmet>
        <title>Savings</title>
      </Helmet>
      <Sidebar/>
      <div className="lg:col-span-4 w-full">
          <DashNav />
          <Saving/>
      </div>
    </div>
  )
}
