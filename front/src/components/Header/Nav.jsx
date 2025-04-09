import React, { useContext, useState } from 'react'
// import { AuthContext } from '../../App';
import Logout from './Logout';
import { Link } from 'react-router-dom';
import Button from '../Button';

export default function Nav({setOpen, isLoggedIn, setIsLoggedIn, user, setUser}) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  console.log("Render Nav")
  // console.log(user);

  return (
    // <nav className='hidden md:block'>
    <nav className='block'>
            
          { isLoggedIn ? 

          ( <ul className='flex gap-x-6'>
              <li>Parcourir</li>
              <li><Link to={`/user/${user?.user?.userId || ''}`}>Compte</Link></li> 
              {/** use optionjal chaining to check is previous property exits before getting access to next property  */}
              <li><Logout setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}/></li>
            </ul> 
          ) 

          : 
          
          ( <div>

              


              <ul className='flex gap-x-6'>
                  <li>
                    <Button onClick={() => setOpen(true)} variant='secondary' className="">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={"16px"} fill='white'>
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
                      </svg>
                    </Button>
                    <button type='button' onClick = {() => setOpen(true)} className=''>
                      
                    </button>
                  </li>
              </ul>
          </div> 
          )
          }





        </nav>
  )
}



