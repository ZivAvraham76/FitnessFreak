"use client"
import React, {useState} from 'react';
import '../auth.css';
import { toast, ToastContainer } from 'react-toastify';

const LoginPage = () => {
  // State to store the values of email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

  // Handle login logic
  const handleLogin = async() =>{
    try{
      // Making a POST request to the backend with the login credentials
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password}),
            credentials: 'include'
        });
            if (response.ok) {
                const data = await response.json();
                console.log('Admin Login Successful',data);
              toast.success('Admin Login Successful', {
              // position: toast.POSITION.TOP_CENTER,
              });
              // Redirect to another page after successful login
              window.location.href = '/pages/addworkout';
            }else {
              console.error('Admin Login failed', response.statusText);
                toast.error('Admin Login failed',{
                  // position: toast.POSITION.TOP_CENTER,
                });
              }
            }
      catch(error){
        toast.error ('An error eccurred during login');
        console.error('An error eccurred during login',error);
      }

  }



  return (
    <div className='formpage'>
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
                                <button onClick={handleLogin}>Login</button>
                                
    </div>
  )
}

export default LoginPage
