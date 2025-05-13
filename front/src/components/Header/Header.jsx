import React, { useContext, useEffect, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
// import { AuthContext } from '../../App';
import Modal from '../Modal';
import UserLoginForm from './UserLoginForm';
import UserRegisterForm from './UserRegisterForm';
import Logout from './Logout';
import Nav from './Nav';
import UserForgotPassword from './UserForgotPassword';

export function Header({user, setUser, openModal}) {

  console.log("render Header");
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!user); // get value of user as default isLoggedIn state
  useEffect(() => setIsLoggedIn(!!user), [user]);



  return (
    <header className='max-w-screen-xl mx-auto flex p-6'>
        
        <h1 className='me-auto uppercase font-black text-2xl'>
          <Link to="/">Musiquiz</Link>
        </h1>
        
        <Nav 
          openModal={openModal} 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          user={user} 
          setUser={setUser}
        />
        
    </header>
  )
}
