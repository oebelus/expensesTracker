import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, useReducer, useState } from "react";
import { getError, getImageUrl } from "../utils/utils";
import { ApiError } from "../types/ApiError";
import { initialState, reducer } from "../context";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";

export default function EditProfile() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const user = state.user
    const currency = state.currency

    const [nameBtn, setnameBtn] = useState(false)
    const [emailBtn, setEmailBtn] = useState(false)
    const [passwordBtn, setPasswordBtn] = useState(false)
    const [currencyBtn, setCurrencyBtn] = useState(false)
    const [deleteBtn, setDeleteBtn] = useState(false)

    const [firstName, setFirstName] = useState(user.firstName)
    const [familyName, setFamilyName] = useState(user.familyName)
    const [email, setEmail] = useState(user.email)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [currencyy, setCurrencyy] = useState("$")

    async function handleImage (e: ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files![0]; 
        const formData = new FormData();
        formData.append("pfp", selectedFile); 
        try {
            const response = await axios.put(`http://localhost:4000/users/image/${user._id}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            dispatch({type: 'EDIT_IMAGE', payload: { image: response.data.image }})
            console.log(user)
            localStorage.setItem('userInfo', JSON.stringify({ ...state.user, image: response.data.image }));
            toast.success("Image Updated Successfully")
            window.location.reload();
        } catch (error) {
            console.log(getError(error as ApiError));
        }
    }

    async function handleEmail(e: React.SyntheticEvent) {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:4000/users/email/${user._id}`, {email: email})
            dispatch({ type: "EDIT_EMAIL", payload: { email: email } });
            localStorage.setItem('userInfo', JSON.stringify({ ...state.user, email }));
            toast.success("Email Updated Successfully");
            setEmailBtn(!emailBtn);
        } catch (error) {
            console.log(error)
        }
    }

    function handleName(e: React.SyntheticEvent) {
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
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An error occurred while updating the name.");
            }
        })
    }

    function handlePassword(e: React.SyntheticEvent) {
        e.preventDefault()
        axios.put(`http://localhost:4000/users/password/${user._id}`, {
            oldPassword: oldPassword,
            newPassword: newPassword
        })
        .then(() => {
            toast.success("Password Updated Successfully")
            localStorage.setItem('userInfo', JSON.stringify({ ...state.user, newPassword }));
            toast.success("Password Updated Successfully"); 
            setPasswordBtn(!passwordBtn)
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An error occurred while updating the password.");
            }
        })
    }

    function handleCurrency(e: React.SyntheticEvent) {
        e.preventDefault()
        axios.put(`http://localhost:4000/users/currency/${user._id}`, {currency: currencyy})
        .then(() => {
            dispatch({type: 'SET_CURRENCY', payload: currencyy})
            toast.success("Currency Updated Successfully"); 
            setCurrencyBtn(!currencyBtn)
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An error occurred while updating the currency.");
            }
        })
    }

    function handleDelete(e: React.SyntheticEvent) {
        e.preventDefault()
        axios.delete(`http://localhost:4000/users/${user._id}`)
        .then(() => {
            toast.success("User deleted successfully")
            dispatch({type: 'USER_SIGNOUT'})
            localStorage.removeItem('userInfo')
            localStorage.removeItem('userId')
            localStorage.removeItem('currency')
            closeDel()
            window.location.href = `/`;
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An error occurred while deleting your account.");
            }
        })
    }

    const closeDel = () => {
        setDeleteBtn(false)
    }

    return (
        <div className="bg-gray-800 text-white h-full">
            <div className="flex flex-col items-center text-center p-8">
                <div className={`border w-max ${!user.image? "p-6" : ""} rounded-full bg-gray-900 mb-4`}>
                    {user.image?
                        <img className="object-contain w-[100px] rounded-full" src={getImageUrl(user.image)} alt="" />
                        :
                        <FontAwesomeIcon icon={faUser} size="4x"/>
                    }
                </div>
                <h2 className="text-xl font-bold">{user.firstName} {user.familyName}</h2>
                <p className="text-gray-500">{user.email}</p>
                <label style={{"cursor": "pointer"}} className="bg-gray-900 p-2 pr-3 pl-3 rounded-lg mt-2" htmlFor="pfp">{user.image ? "Edit Your " : "Add a "}Profile Picture</label>
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
                            <div className="flex gap-2">
                                <button onClick={handleName} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Save</button>
                                <button onClick={() => setnameBtn(!nameBtn)} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Cancel</button>
                            </div>
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
                                <div className="flex gap-2">
                                    <button onClick={handlePassword} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Save</button>
                                    <button onClick={() => setPasswordBtn(!passwordBtn)} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Cancel</button>
                                </div>
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
                                <div className="flex gap-2">
                                    <button onClick={handleEmail} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Save</button>
                                    <button onClick={() => setEmailBtn(!emailBtn)} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Cancel</button>
                                </div>
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
                    <div>
                        { currencyBtn ? 
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold mb-2">Currency</h3>
                                    <input className="text-black rounded-lg" type="text" value={currencyy} onChange={(e) => setCurrencyy(e.target.value)} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleCurrency} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Save</button>
                                    <button onClick={() => setCurrencyBtn(!currencyBtn)} className="bg-gray-900 p-1 pr-5 pl-5 rounded-lg mt-2">Cancel</button>
                                </div>
                            </div>
                            : 
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold mb-2">Currency</h3>
                                    <p>{currency}</p> 
                                </div>
                                <button onClick={() => {setCurrencyBtn(!currencyBtn)}} className="bg-gray-900 p-1 pr-2 pl-2 rounded-lg mt-2">Change</button>
                            </div>
                        }
                    </div>
                    <div>
                        { deleteBtn ? 
                            <Modal
                                open={deleteBtn}
                                onClose={closeDel}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <div className="flex items-center justify-center h-full">
                                    <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100">
                                        <h2 className="text-xl font-semibold leading-tight tracking-tight text-center">Delete Your Profile</h2>
                                        <p className="flex-1 text-center dark:text-gray-400">Are you sure that you want to delete your profile?
                                        </p>
                                        <div className="flex justify-center gap-3 mt-6 sm:mt-8 sm:flex-row">
                                            <button onClick={closeDel} className="px-6 py-2 rounded-sm">Cancel</button>
                                            <button onClick={handleDelete} className="px-6 py-2 rounded-sm shadow-sm dark:bg-violet-400 dark:text-gray-900">Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                            : 
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold mb-2">Delete Your Profile</h3>
                                    <p>Don't do it</p> 
                                </div>
                                <button onClick={() => {setDeleteBtn(!deleteBtn)}} className="bg-red-900 p-1 text-white pr-2 pl-2 rounded-lg mt-2">Delete</button>
                            </div>
                        }
                    </div>
            </div>
        </div>
  )
}
