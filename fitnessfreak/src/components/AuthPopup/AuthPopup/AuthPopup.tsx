import React, { useState } from 'react'
import './AuthPopup.css'
import Image from 'next/image'
import logo from '@/aseets/logo.png'
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { ToastContainer, toast } from 'react-toastify';

// Interface for AuthPopup props
interface AuthPopupProps {
    setShowpopup: React.Dispatch<React.SetStateAction<boolean>>;
}
// Interface for signup form data
interface signupFormData{
    name: String | null,
    email:String | null,
    password: String | null,
    heightInCm: Number | null,
    weightInKg: Number | null,
    goal: String | null,
    gender: String | null,
    dob: Date | null,
    activityLevel: String | null
}
// Interface for login form data
interface loginFormData{
    email:String | null,
    password: String | null
}

const AuthPopup: React.FC<AuthPopupProps> = ({ setShowpopup }) => {
    // State for toggling between signup and login forms
    const [showSignup, setShowSignup] = React.useState<boolean>(false)
    // State for storing signup form data
    const [signupFormData, setSignupFormData] = useState<signupFormData>({
    name: '',
    email: '',
    password: '',
    heightInCm: 0.0,
    weightInKg: 0.0,
    goal: '',
    gender: '',
    dob: new Date(),
    activityLevel: ''
    })
    // State for storing login form data
    const [loginFormData, setloginFormData] = useState<loginFormData>({
        email: '',
        password: ''
        })
    // Function to handle login
    const handleLogin = () => {
        console.log(loginFormData);
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginFormData),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)

            if (data.ok) {
                toast.success(data.message)
                setShowpopup(false)
            }
            else {
                toast.error(data.message)
            }
        }).catch(err => {
            console.log(err)
        })

    }
    // Function to handle signup
    const handleSignup = () => { 
        console.log(signupFormData);
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupFormData),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)

            if (data.ok) {
                toast.success(data.message)
                setShowSignup(false)
            }
            else {
                toast.error(data.message)
            }
        }).catch(err => {
            console.log(err)
        })

    }

    // Render either the signup or login form based on the 'showSignup' state.
    // If true, display the signup form; if false, display the login form.
    return (
        <div className='popup'>
            <button className='close'
                onClick={() => {
                    setShowpopup(false)
                }}
            >
                <AiOutlineClose />
            </button>
            {
                showSignup ? (
                    <div className='authform'>
                        <div className='left'>
                            <Image src={logo} alt="Logo" />
                        </div>
                        <div className='right'>
                            <h1>Signup to become a freak</h1>
                            <form action="">
                            <Input
                                    color="warning"
                                    placeholder="name"
                                    size="lg"
                                    variant="solid"
                                    onChange={(e) => {
                                        setSignupFormData({
                                            ...signupFormData,
                                            name: e.target.value
                                        })
                                    }}
                                />
                                <Input
                                    color="warning"
                                    placeholder="email"
                                    size="lg"
                                    variant="solid"

                                    onChange={(e) => {
                                        setSignupFormData({
                                            ...signupFormData,
                                            email: e.target.value
                                        })
                                    }}
                                />
                                <Input
                                    color="warning"
                                    placeholder="password"
                                    size="lg"
                                    variant="solid"
                                    type='password'

                                    onChange={(e) => {
                                        setSignupFormData({
                                            ...signupFormData,
                                            password: e.target.value
                                        })
                                    }}
                                />


                                <Input color="warning" size="lg" variant="solid" type="number" placeholder='Weight in kg'
                                    onChange={(e) => {
                                        setSignupFormData({
                                            ...signupFormData,
                                            weightInKg: parseFloat(e.target.value)
                                        })
                                    }}
                                />

                                <Select
                                    color="warning"
                                    placeholder="Activity Level"
                                    size="lg"
                                    variant="solid"

                                    onChange={(
                                        event: React.SyntheticEvent | null,
                                        newValue: string | null,
                                    ) => {
                                        setSignupFormData({
                                            ...signupFormData,
                                            activityLevel: newValue?.toString() || ''
                                        })
                                    }}
                                >
                                    <Option value="sedentary">Sedentary</Option>
                                    <Option value="light">Light</Option>
                                    <Option value="moderate">Moderate</Option>
                                    <Option value="active">Active</Option>
                                    <Option value="veryActive">Very Active</Option>
                                </Select>

                                <Select
                                    color="warning"
                                    placeholder="Goal"
                                    size="lg"
                                    variant="solid"

                                    onChange={(
                                        event: React.SyntheticEvent | null,
                                        newValue: string | null,
                                    ) => {
                                        setSignupFormData({
                                            ...signupFormData,
                                            goal: newValue?.toString() || ''
                                        })
                                    }}
                                >
                                    <Option value="weightLoss">Lose</Option>
                                    <Option value="weightMaintain">Maintain</Option>
                                    <Option value="weightGain">Gain</Option>
                                </Select>

                                <Select
                                    color="warning"
                                    placeholder="Gender"
                                    size="lg"
                                    variant="solid"

                                    onChange={(
                                        event: React.SyntheticEvent | null,
                                        newValue: string | null,
                                    ) => {
                                        setSignupFormData({
                                            ...signupFormData,
                                            gender: newValue?.toString() || ''
                                        })
                                    }}
                                >
                                    <Option value="male">Male</Option>
                                    <Option value="female">Female</Option>
                                    <Option value="other">Other</Option>
                                </Select>

                                <Input color="warning" size="lg" variant="solid" type="number" placeholder='Height in cm'
                                    onChange={(e) => {
                                        setSignupFormData({
                                            ...signupFormData,
                                            heightInCm: parseFloat(e.target.value)
                                        })
                                    }}
                                />


                                <label htmlFor="">Date of Birth</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}

                                >
                                    <DesktopDatePicker defaultValue={dayjs(new Date())}
                                        sx={{
                                            backgroundColor: 'white',
                                        }}

                                        onChange={(newValue) => {
                                            setSignupFormData({
                                                ...signupFormData,
                                                dob: new Date(newValue as any)
                                            })
                                        }}
                                    />
                                </LocalizationProvider>



                                <button onClick={(e) =>{
                                    e.preventDefault()
                                    handleSignup()
                                }
                                }>Signup</button>

                            </form>
                            <p>Already have an account?
                                <button onClick={() => {
                                    setShowSignup(false)
                                }}>Login</button></p>
                        </div>

                    </div>
                ) : (
                    <div className='authform'>
                        <div className='left'>
                            <Image src={logo} alt="Logo" />
                        </div>
                        <div className='right'>
                            <h1>Login to become a freak</h1>
                            <form action="">
                            <Input
                                    color="warning"
                                    placeholder="email"
                                    size="lg"
                                    variant="solid"
                                    onChange={(e) => {
                                        setloginFormData({
                                            ...loginFormData,
                                            email: e.target.value
                                        })
                                    }}
                                />

                                <Input
                                    color="warning"
                                    placeholder="password"
                                    size="lg"
                                    variant="solid"
                                    type='password'

                                    onChange={(e) => {
                                        setloginFormData({
                                            ...loginFormData,
                                            password: e.target.value
                                        })
                                    }}
                                />
                                <button onClick={(e) =>{
                                    e.preventDefault()
                                    handleLogin()
                                }
                                }>Log in</button>
                            </form>
                            <p>Don't have an account?
                                <button onClick={() => {
                                    setShowSignup(true)
                                }}>signup</button></p>
                        </div>

                    </div>
                )
            }
        </div>
    )
}

export default AuthPopup
