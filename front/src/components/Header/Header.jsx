import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../App';
import Modal from '../Modal';
import UserLoginForm from './UserLoginForm';
import UserRegisterForm from './UserRegisterForm';
import Logout from './Logout';
import Nav from './Nav';

export function Header() {

  console.log("render Header");

  // const {user, setUser } = useContext(AuthContext);

  // console.log("Le contexte" , user);

  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState("login");


  return (
    <header className='flex border border-white-800 p-6'>
        
        <h1 className='me-auto'>
          <Link to="/">Musiquiz</Link>
        </h1>

        
        <Nav setOpen={setOpen}/>
        

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
                  <h3 className='text-lg font-black text-gray-800'>S'inscrire</h3>
                  <p className='text-sm text-gray-500'>
                    Enregistrez vous pour pouvoir joueur au jeu
                  </p>
                </div>
              )}
              

            {
              // toggle 4 renderings ??? why ?????
              modalContent === "login" ? 
              (
                <UserLoginForm setModalContent={setModalContent} setOpen={setOpen}/>
              ) 
              : 
              (
                <UserRegisterForm setModalContent={setModalContent} />
              ) 
            }              

          </div>

        </Modal>


    </header>
  )
}