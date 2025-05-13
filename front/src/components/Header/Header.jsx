import React, { useContext, useEffect, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
// import { AuthContext } from '../../App';
import Modal from '../Modal';
import UserLoginForm from './UserLoginForm';
import UserRegisterForm from './UserRegisterForm';
import Logout from './Logout';
import Nav from './Nav';
import UserForgotPassword from './UserForgotPassword';

export function Header({user, setUser}) {

  console.log("render Header");
  // console.log(user);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // get value of user as default isLoggedIn state

  // const userInfo = user && Object.keys(user.user).length > 0 ? user : null;

  const userInfo = user ?? null;

  useEffect(() => {
    if(user != null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);


  return (
    <header className='max-w-screen-xl mx-auto flex p-6'>
        
        <h1 className='me-auto uppercase font-black text-2xl'>
          <Link to="/">Musiquiz</Link>
        </h1>

        
        <Nav setOpen={setOpen} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} setUser={setUser}/>
        

        <Modal open={open} onClose={() => {setOpen(false)}}>
          <div className='text-center w-72 z-80'>


              {modalContent === "login" &&
                <div className='mx-auto my-4 w-64'>           
                  <h3 className='text-lg font-black text-gray-800'>Se connecter</h3>
                  <p className='text-sm text-gray-500'>
                    Connectez vous pour pouvoir jouer au jeu
                  </p>
                </div>
              }

                {modalContent === "register" &&
                <div className='mx-auto my-4 w-64'>           
                  <h3 className='text-lg font-black text-gray-800'>S'inscrire</h3>
                  <p className='text-sm text-gray-500'>
                    Enregistrez vous pour pouvoir joueur au jeu
                  </p>
                </div>
              }

                {modalContent === "forgot-password" &&
                <div className='mx-auto my-4 w-64'>           
                  <h3 className='text-lg font-black text-gray-800'>Réinitiliaser votre mot de passe</h3>
                  <p className='text-sm text-gray-500'>
                    Renseignez le mail associé à votre compte pour pouvoir réinitiliaser votre mot de passe.
                    <br/>
                    Vous recevrez un lien permettant d'accéder à une page où vous pourrez choisir votre nouveau mot de passe.
                  </p>
                </div>
              }
              

            { modalContent === "login" && <UserLoginForm setModalContent={setModalContent} open={open} setOpen={setOpen} setIsLoggedIn={setIsLoggedIn} user={userInfo} /> }
            { modalContent === "register" && <UserRegisterForm setModalContent={setModalContent} /> }
            { modalContent === "forgot-password" && <UserForgotPassword setModalContent={setModalContent} />}

          </div>

        </Modal>


    </header>
  )
}
