import React, { useContext } from 'react'
// import { AuthContext } from '../../App';
import Logout from './Logout';
import { Link } from 'react-router-dom';

export default function Nav({setOpen, isLoggedIn, setIsLoggedIn, user}) {

    // const {user, setUser } = useContext(AuthContext);



  return (
    <nav className='hidden md:block'>
            
          { isLoggedIn ? 

          ( <ul className='flex gap-x-6'>
              <li>Parcourir</li>
              <li><Link to={`/user/${user.userId}`}>Compte</Link></li>
              <li><Logout setIsLoggedIn={setIsLoggedIn} user={user}/></li>
            </ul> 
          ) 

          : 
          
          ( <ul className='flex gap-x-6'>
                <li>
                  <button type='button' onClick = {() => setOpen(true)} className='py-2 px-4 font-semibold shadow-md rounded-lg bg-slate-400'>
                    Se connecter / S'inscrire
                  </button>
                </li>
            </ul> 
          )
          }
        </nav>
  )
}
