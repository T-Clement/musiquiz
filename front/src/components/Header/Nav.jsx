import React, { useContext } from 'react'
import { AuthContext } from '../../App';
import Logout from './Logout';

export default function Nav({setOpen}) {

    const {user, setUser } = useContext(AuthContext);



  return (
    <nav className='hidden md:block'>
            
          { user !== null ? 

          ( <ul className='flex gap-x-6'>
              <li>Parcourir</li>
              <li>Compte</li>
              <li><Logout/></li>
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
