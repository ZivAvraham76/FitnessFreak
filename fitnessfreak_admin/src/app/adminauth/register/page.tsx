"use client"
import React, {useState} from 'react';
import '../auth.css';
import { toast, ToastContainer } from 'react-toastify';


const SignupPage = () => {

  // Defining state variables for the form fields (name, email, password)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function that handles the signup process
  const handleSignup = async() =>{
    try{
        // Sending the user data to the backend API to create a new admin user
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name,email,password}),
            credentials: 'include'
        })
        const data = await response.json();
            if (data.ok) {
              toast.success('Admin Registration Successful', {
              // position: toast.POSITION.TOP_CENTER,
              });
            }else {
              console.error('Admin Registration failed', response.statusText);

                toast.error('Admin Registration failed',{
                  // position: toast.POSITION.TOP_CENTER,
                });
              }
            }
      catch(error){
        toast.error ('An error eccurred during registration');
        console.error('An error eccurred during registration',error);
      }

  }



  return (
    <div className='formpage'>
      <input
                                    type = 'text'
                                    placeholder="Name"
                                    value = {name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                               <input
                                    type = 'email'
                                    placeholder="Email"
                                    value = {email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type = 'password'
                                    placeholder="Password"
                                    value = {password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button onClick={handleSignup}>Signup</button>
                                
    </div>
  )
}

export default SignupPage
