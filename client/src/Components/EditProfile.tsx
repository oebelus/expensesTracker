import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, useReducer, useState } from "react";
import { getError } from "../../utils";
import { ApiError } from "../types/ApiError";
import { initialState, reducer } from "../context";
import { toast } from "react-toastify";

export default function EditProfile() {
    const [state, ] = useReducer(reducer, initialState)
    const user = state.user

    const [nameBtn, setnameBtn] = useState(false)
    const [emailBtn, setEmailBtn] = useState(false)
    const [passwordBtn, setPasswordBtn] = useState(false)

    const [firstName, setFirstName] = useState("")
    const [familyName, setFamilyName] = useState("")
    const [email, setEmail] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    async function handleImage (e: ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files![0]; 

        const formData = new FormData();
        formData.append("pfp", selectedFile); 
        try {
            await axios.put(`http://localhost:4000/users/image/${user._id}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
        } catch (err) {
            console.log(getError(err as ApiError));
        }
    }

    async function handleEmail(e: React.SyntheticEvent) {
        e.preventDefault()
        axios.put(`http://localhost:4000/users/email/${user._id}`, email)
        .then(() => toast.success("Email Updated Successfully"))
        .catch((err) => toast.error(getError(err as ApiError)))
    }

    async function handleName(e: React.SyntheticEvent) {
        e.preventDefault()
        console.log(user._id)
        axios.put(`http://localhost:4000/users/name/${user._id}`, {
            firstName: firstName,
            familyName: familyName,
        })
            .then(() => toast.success("Name Updated Successfully"))
            .catch((err) => toast.error(getError(err as ApiError)))
        setnameBtn(!nameBtn)
    }

    async function handlePassword(e: React.SyntheticEvent) {
        e.preventDefault()
        axios.put(`http://localhost:4000/users/password/${user._id}`, newPassword)
        .then(() => toast.success("Password Updated Successfully"))
        .catch((err) => console.log(getError(err as ApiError)))
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
                        { !nameBtn ? 
                            <div>
                                <p>{user!.firstName} {user!.familyName}</p> 
                                <button onClick={() => setnameBtn(!nameBtn)} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                            </div>
                            : 
                            <div>
                                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" type="text" />
                                <input value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Family Name" type="text" />
                                <button onClick={handleName} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Save</button>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex justify-between lg:w-[40%]">
                    <div>
                        <h3 className="font-bold">Password</h3>
                        { !passwordBtn ? 
                            <div>
                                <p>********</p> 
                                <button onClick={() => setPasswordBtn(!passwordBtn)} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                            </div>
                            : 
                            <div>
                                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Your Old Password" />
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Your New Password" />
                                <button onClick={handlePassword} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Save</button>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex justify-between lg:w-[40%]">
                    <div>
                        <h3 className="font-bold">Email</h3>
                        { emailBtn ? 
                            <div className="flex justify-between lg:w-[40%]">
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button onClick={handleEmail} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Save</button>
                            </div>
                            : 
                            <div>
                                <p>{user!.email}</p> 
                                <button onClick={() => setEmailBtn(!emailBtn)} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
  )
}
