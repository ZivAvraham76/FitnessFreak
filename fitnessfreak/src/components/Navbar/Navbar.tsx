"use client"
import React from 'react'
import logo from '@/aseets/logo.png'
import { IoIosBody } from 'react-icons/io'
import './Navbar.css'
import Image from 'next/image'
import Link from 'next/link'
import AuthPopup from '../AuthPopup/AuthPopup/AuthPopup'

const Navbar = () => {
  // State to track if the user is logged in or not.
  const [isloggedin, setIsloggedin] = React.useState<boolean>(false)
  // State to control if the login popup should be shown.
  const [showpopup, setShowpopup] = React.useState<boolean>(false)

  // Function to check if the user is logged in.
  const checklogin = async () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/checklogin', {
        method: 'POST',
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.ok) {
                setIsloggedin(true)
            }
            else{
                setIsloggedin(false)
            }
        })
        .catch(err => {
            console.log(err)
        })
}

// Effect hook that runs when the component is mounted or when showpopup state changes.
React.useEffect(() => {
    checklogin()
}, [showpopup])

  // Render "Login" or "Logout" button based on user login status. 
 // If the user is not logged in, show the AuthPopup when `showpopup` is true.
  return (
    <nav>
        <Image src={logo} alt="Logo" />
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/profile"><IoIosBody/></a>
        {
          isloggedin ?
          <button>Logout</button>
          :
          <button onClick={() => {
            setShowpopup(true)
          }}
          >Login</button>
        }

        {
          showpopup && <AuthPopup setShowpopup={setShowpopup}/>
        }
    </nav>
  )
}

export default Navbar
