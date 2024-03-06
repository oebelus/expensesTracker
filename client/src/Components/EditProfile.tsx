import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../types/User";
import { getError } from "../../utils";
import { ApiError } from "../types/ApiError";

export default function EditProfile() {
    const [user, setUser] = useState<User>({})
    const userId = localStorage.getItem("userId")

    useEffect(() => {
        axios.get(`http://localhost:4000/users/${userId}`)
        .then((response) =>setUser(response.data))
        .catch((err) => getError(err as ApiError))
    }, [userId])


    return (
        <div className="bg-gray-800 text-white h-screen">
            <div className="flex flex-col items-center text-center p-8">
                <div className="border w-max rounded-full p-6 bg-gray-900 mb-4"><FontAwesomeIcon icon={faUser} size="4x"/></div>
                <h2 className="text-xl font-bold">{user!.firstName} {user!.familyName}</h2>
                <p className="text-gray-500">{user!.email}</p>
                <button className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Add a Profile Picture</button>
            </div>
            <div className="flex flex-col p-4 gap-8 lg:items-center">
                <div className="flex justify-between lg:w-[40%]">
                    <div>
                        <h3 className="font-bold">Name</h3>
                        <p>{user!.firstName} {user!.familyName}</p>
                    </div>
                    <button className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                </div>
                <div className="flex justify-between lg:w-[40%]">
                    <div>
                        <h3 className="font-bold">Password</h3>
                        <p>********</p>
                    </div>
                    <button className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                </div>
                <div className="flex justify-between lg:w-[40%]">
                    <div>
                        <h3 className="font-bold">Email</h3>
                        <p>{user!.email}</p>
                    </div>
                    <button className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                </div>
            </div>
        </div>
  )
}
