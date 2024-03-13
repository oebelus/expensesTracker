import { Helmet } from "react-helmet-async";
import DashNav from "../Components/DashNav";
import EditProfile from "../Components/EditProfile";

export default function Profile() {
  return (
    <div>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <DashNav/>
      <EditProfile/>
    </div>
  )
}
