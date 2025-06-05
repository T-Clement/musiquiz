import { useEffect, useState } from 'react'
import Nav from './Nav';
import LinkWithViewTransition from '../LinkWithViewTransition';

export function Header({user, setUser, openModal}) {

  console.log("render Header");
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!user); // get value of user as default isLoggedIn state
  useEffect(() => setIsLoggedIn(!!user), [user]);



  return (
    <header className='max-w-screen-xl mx-auto flex p-6'>
        
        <h1 className='me-auto uppercase font-black text-2xl'>
          <LinkWithViewTransition to="/">Musiquiz</LinkWithViewTransition>
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
