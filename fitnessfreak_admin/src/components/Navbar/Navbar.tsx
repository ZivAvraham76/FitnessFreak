"use client"
import React, { useState } from 'react'
import './Navbar.css'
import Image from 'next/image'
import Link from 'next/link'
import logo from './logo.png'
import { headers } from 'next/headers'


const Navbar = () => {
    // State hook to track admin authentication status
    const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState<boolean>(false)
    // Function to check if the admin is authenticated by sending a GET request
    const checkAdminAuthenticated  = async () => {
        try {
            // Sending a request to check if the admin is logged in
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            if (response.ok) {
                setIsAdminAuthenticated(true)
            }
            else{
                setIsAdminAuthenticated(false)
            }
        }
        catch(err){
            console.log(err)
            setIsAdminAuthenticated(false);
        }

    }

    // useEffect hook to call the checkAdminAuthenticated function when the component mounts
    React.useEffect(() => {
        checkAdminAuthenticated()
    }, [])

  return (
    <div className='navbar'>
        <Image src={logo} alt="Logo" width={100} className='logo'/>
        <div className="adminlinks">
            {isAdminAuthenticated?(
                <>
                <Link href= '/pages/addworkout'>Add Workout</Link>
                </>
            ):(
                <>
                <Link href= '/adminauth/login'>Login</Link>
                <Link href= '/adminauth/register'>Signup</Link>
                </>
            )}
        </div>

      
    </div>
  )
}

export default Navbar
