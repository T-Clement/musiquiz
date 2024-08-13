import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App';
import Modal from './Modal';

export function Header() {


  const currentUser = useContext(AuthContext);

  const [open, setOpen] = useState(false);


  return (
    <header className='flex border border-white-800 p-6'>
        
        <h1 className='me-auto'><Link to="/">Musiquiz</Link></h1>

        

        <nav className='hidden md:block'>
            
          { currentUser ? 
          ( <ul className='flex gap-x-6'>
              <li>Parcourir</li>
              <li>Compte</li>
              <li>Se déconnecter</li>
          </ul> ) 
          : ( <ul className='flex gap-x-6'>
                <li>
                  <button type='button' onClick = {() => setOpen(true)} className='py-2 px-4 font-semibold shadow-md rounded-lg bg-slate-400'>
                    Se connecter
                  </button>
                </li>
            </ul> )
          }
        </nav>

        <Modal open={open} onClose={() => {setOpen(false)}}>
          <div className='text-center w-56'>

            <div className='mx-auto my-4 w-48'>
              
              {/* icon */}

              <h3 className='text-lg font-black text-gray-800'>Connexion</h3>
              <p className='text-sm text-gray-500'>
                Connectez vous pour pouvoir joueur au jeu
              </p>
            </div>
            <div className='flex gap-4'>
               <button className='py-2 px-4 font-semibold shadow-md rounded-lg w-full bg-gray-400' onClick={() => {setOpen(false)}}>Cancel</button>
               <button className='py-2 px-4 font-semibold shadow-md rounded-lg w-full bg-lime-300'>Confirm</button>
            </div>
          </div>
        </Modal>


    </header>
  )
}
