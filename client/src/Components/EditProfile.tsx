import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState, ChangeEvent } from "react";
import { User } from "../types/User";
import { getError } from "../../utils";
import { ApiError } from "../types/ApiError";

export default function EditProfile() {
    const [user, setUser] = useState<User>({})

    const userId = localStorage.getItem("userId")

    useEffect(() => {
        axios.get(`http://localhost:4000/users/${userId}`)
        .then((response) =>{setUser(response.data)})
        .catch((err) => getError(err as ApiError))
    }, [userId])

    async function handleImage (e: ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files![0]; 

        const formData = new FormData();
        formData.append("pfp", selectedFile); 
        try {
            await axios.put(`http://localhost:4000/users/image/${userId}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
        } catch (err) {
            console.log(getError(err as ApiError));
        }
    }

    return (
        <div className="bg-gray-800 text-white h-screen">
            <div className="flex flex-col items-center text-center p-8">
                <div className={`border w-max ${!user.image? "p-6" : ""} rounded-full bg-gray-900 mb-4`}>
                    {user.image?
                        <img className="object-contain w-[100px] rounded-full" src={`/profile/${user.image}`} alt="" />
                        :
                        <FontAwesomeIcon icon={faUser} size="4x"/>
                    }
                </div>
                <h2 className="text-xl font-bold">{user!.firstName} {user!.familyName}</h2>
                <p className="text-gray-500">{user!.email}</p>
                <label style={{"cursor": "pointer"}} className="bg-gray-900 p-2 pr-3 pl-3 rounded-lg mt-2" htmlFor="pfp">Add a Profile Picture</label>
                <input onChange={handleImage} className="hidden" name="pfp" type="file" accept="image/*" id="pfp" />
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
