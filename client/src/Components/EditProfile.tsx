import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, useReducer, useState } from "react";
import { getError } from "../../utils";
import { ApiError } from "../types/ApiError";
import { initialState, reducer } from "../context";
import { toast } from "react-toastify";

export default function EditProfile() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const user = state.user

    const [nameBtn, setnameBtn] = useState(false)
    const [emailBtn, setEmailBtn] = useState(false)
    const [passwordBtn, setPasswordBtn] = useState(false)

    const [firstName, setFirstName] = useState("")
    const [familyName, setFamilyName] = useState("")
    const [email, setEmail] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [image, setImage] = useState("")

    async function handleImage (e: ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files![0]; 

        const formData = new FormData();
        formData.append("pfp", selectedFile); 
        try {
            const response = await axios.put(`http://localhost:4000/users/image/${user._id}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            setImage(response.data)
            console.log(image)
            localStorage.setItem('userInfo', JSON.stringify({ ...state.user, image }));
        } catch (err) {
            console.log(getError(err as ApiError));
        }
    }

    async function handleEmail(e: React.SyntheticEvent) {
        e.preventDefault()
        axios.put(`http://localhost:4000/users/email/${user._id}`, {email: email})
        .then(() => {
            dispatch({type: "EDIT_EMAIL", payload: email})
            localStorage.setItem('userInfo', JSON.stringify({ ...state.user, email }));
            toast.success("Email Updated Successfully")
            setEmailBtn(!emailBtn)
        })
        .catch((err) => toast.error(getError(err as ApiError)))
    }

    async function handleName(e: React.SyntheticEvent) {
        e.preventDefault()
        axios.put(`http://localhost:4000/users/name/${user._id}`, {
            firstName: firstName,
            familyName: familyName,
        })
        .then(() => {
            dispatch({type: "EDIT_NAME", payload: { firstName, familyName }})
            localStorage.setItem('userInfo', JSON.stringify({ ...state.user, firstName, familyName }));
            toast.success("Name Updated Successfully"); 
            setnameBtn(!nameBtn)
        })
        .catch((err) => toast.error(getError(err as ApiError)))
    }

    async function handlePassword(e: React.SyntheticEvent) {
        e.preventDefault()
        axios.put(`http://localhost:4000/users/password/${user._id}`, {oldPassword, newPassword})
        .then(() => {
            toast.success("Password Updated Successfully")
            localStorage.setItem('userInfo', JSON.stringify({ ...state.user, newPassword }));
            setPasswordBtn(!passwordBtn)
        })
        .catch((err) => toast.error(getError(err as ApiError)))
    }

    return (
        <div className="bg-gray-800 text-white h-full">
            <div className="flex flex-col items-center text-center p-8">
                <div className={`border w-max ${!user.image? "p-6" : ""} rounded-full bg-gray-900 mb-4`}>
                    {user.image?
                        <img className="object-contain w-[100px] rounded-full" src={`/profile/${user.image}`} alt="" />
                        :
                        <FontAwesomeIcon icon={faUser} size="4x"/>
                    }
                </div>
                <h2 className="text-xl font-bold">{user.firstName} {user.familyName}</h2>
                <p className="text-gray-500">{user.email}</p>
                <label style={{"cursor": "pointer"}} className="bg-gray-900 p-2 pr-3 pl-3 rounded-lg mt-2" htmlFor="pfp">Add a Profile Picture</label>
                <input onChange={handleImage} className="hidden" name="pfp" type="file" accept="image/*" id="pfp" />
            </div>
            <div className="flex flex-col p-4 gap-8 lg:relative lg:left-[20%] lg:w-[60%]">
                <div>
                    { nameBtn ? 
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold mb-2">Name</h3>
                                <div>
                                    <input className='text-black mr-3 rounded-lg mb-2' value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" type="text" />
                                    <input className='text-black rounded-lg' value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Family Name" type="text" />
                                </div>
                            </div>
                            <button onClick={handleName} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Save</button>
                        </div>
                        : 
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <h3 className=" float-left font-bold mb-2">Name</h3>
                                <p>{user!.firstName} {user!.familyName}</p>
                            </div> 
                            <button onClick={() => {setnameBtn(!nameBtn); setFirstName(user.firstName); setFamilyName(user.familyName)}} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                        </div>
                    }
                </div>
                    <div className="">
                        { passwordBtn ? 
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold mb-2">Password</h3> 
                                    <div>
                                        <input className="text-black mr-3 rounded-lg mb-2" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Your Old Password" />
                                        <input className="text-black rounded-lg" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Your New Password" />
                                    </div>
                                </div>
                                <button onClick={handlePassword} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Save</button>
                            </div>
                            : 
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold mb-2">Password</h3> 
                                    <p>********</p> 
                                </div>
                                <button onClick={() => setPasswordBtn(!passwordBtn)} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                            </div>
                        }
                    </div>
                    <div>
                        { emailBtn ? 
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold mb-2">Email</h3>
                                    <input className="text-black rounded-lg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <button onClick={handleEmail} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Save</button>
                            </div>
                            : 
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold mb-2">Email</h3>
                                    <p>{user!.email}</p> 
                                </div>
                                <button onClick={() => {setEmailBtn(!emailBtn); setEmail(user.email)}} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                            </div>
                        }
                    </div>
            </div>
        </div>
  )
}
