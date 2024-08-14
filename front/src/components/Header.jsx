import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App';
import Modal from './Modal';

export function Header() {


  const currentUser = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState("login");


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
                    Se connecter / S'inscrire
                  </button>
                </li>
            </ul> )
          }
        </nav>

        <Modal open={open} onClose={() => {setOpen(false)}}>
          <div className='text-center w-72'>


              {modalContent === "login" ? (
                <div className='mx-auto my-4 w-64'>           
                  <h3 className='text-lg font-black text-gray-800'>Se connecter</h3>
                  <p className='text-sm text-gray-500'>
                    Connectez vous pour pouvoir jouer au jeu
                  </p>
                </div>
              ) 
              :
              (
                <div className='mx-auto my-4 w-64'>           
                  <h3 className='text-lg font-black text-gray-800'>Enregistrer</h3>
                  <p className='text-sm text-gray-500'>
                    Enregistrez vous pour pouvoir joueur au jeu
                  </p>
                </div>
              )}
              

            {
              modalContent === "login" ? 
              (
                <form>
              <div className="space-y-6">
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Votre email</label>
                  <input name="email" type="text" className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Entrez votre email" />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Votre mot de passe</label>
                  <input name="password" type="password" className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Entrez votre mot de passe" />
                </div>

              </div>

              <div className="!mt-12">
                <button type="button" className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  Se connecter
                </button>
              </div>
              <p className="text-gray-800 text-sm mt-6 text-center">Vous n'avez pas de compte ? <a onClick={() => {setModalContent("register")}} class="text-blue-600 font-semibold hover:underline ml-1">Inscivez vous</a></p>
            </form>
              ) 
              : 
              (
                <form>
              <div className="space-y-6">
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Email</label>
                  <input name="email" type="text" className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Entrez votre email" />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Pseudo</label>
                  <input name="pseudo" type="text" className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Entrez votre pseudo" />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Confirmez le mot de passe</label>
                  <input name="password" type="password" className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Entrez votre mot de passe" />
                </div>

              </div>

              <div className="!mt-12">
                <button type="button" className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  Créer votre compte
                </button>
              </div>
              <p className="text-gray-800 text-sm mt-6 text-center">Vous avez un compte ? <a onClick={() => setModalContent("login")} class="text-blue-600 font-semibold hover:underline ml-1">Connectez vous</a></p>
            </form>
              ) 
            }              
            


{/* 
            <div className='flex gap-4'>
               <button className='py-2 px-4 font-semibold shadow-md rounded-lg w-full bg-gray-400' onClick={() => {setOpen(false)}}>Cancel</button>
               <button className='py-2 px-4 font-semibold shadow-md rounded-lg w-full bg-lime-300'>Confirm</button>
            </div> */}
          </div>



        </Modal>


    </header>
  )
}
