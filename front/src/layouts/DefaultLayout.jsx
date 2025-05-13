import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { AuthContext } from "../hooks/authContext";
import Modal from "../components/Modal";
import UserLoginForm from "../components/Header/UserLoginForm";
import UserRegisterForm from "../components/Header/UserRegisterForm";
import UserForgotPassword from "../components/Header/UserForgotPassword";

export function DefaultLayout() {
  console.log("render Default Layout");

  const [modal, setModal] = useState({open: false, view: "login"});
  const openModal = (view) => setModal({open: true, view});
  const closeModal = () => setModal({open: false, view: modal.view});
  const setView = (view) => setModal((prev) => ({...prev, view}));

  
  
  const { user, setUser, loading } = useContext(AuthContext);
  const userInfo = user ?? null;



  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  useEffect(() => {
    if(user != null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);



  if (loading) {
    return <div>Chargement ...</div>;
  }

  console.log("User in DefaultLayout : ", user);

  return (
    <>
      <div className="sticky top-0 z-20 bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-md">
        <Header user={user} setUser={setUser} openModal={openModal}/>
      </div>
      <div className="max-w-screen-xl	mx-auto">
        <p>DefaultLayout</p>
        <Outlet />
      </div>


      <Modal open={modal.open} onClose={closeModal}>
          <div className='text-center w-72 z-30'>


              {modal.view == "login" &&
                <div className='mx-auto my-4 w-64'>           
                  <h3 className='text-lg font-black text-gray-800'>Se connecter</h3>
                  <p className='text-sm text-gray-500'>
                    Connectez vous pour pouvoir jouer au jeu
                  </p>
                </div>
              }

                {modal.view === "register" &&
                <div className='mx-auto my-4 w-64'>           
                  <h3 className='text-lg font-black text-gray-800'>S'inscrire</h3>
                  <p className='text-sm text-gray-500'>
                    Enregistrez vous pour pouvoir joueur au jeu
                  </p>
                </div>
              }

                {modal.view === "forgot-password" &&
                <div className='mx-auto my-4 w-64'>           
                  <h3 className='text-lg font-black text-gray-800'>Réinitiliaser votre mot de passe</h3>
                  <p className='text-sm text-gray-500'>
                    Renseignez le mail associé à votre compte pour pouvoir réinitiliaser votre mot de passe.
                    <br/>
                    Vous recevrez un lien permettant d'accéder à une page où vous pourrez choisir votre nouveau mot de passe.
                  </p>
                </div>
              }
              

            { modal.view === "login" && <UserLoginForm switchTo={setView}  user={userInfo} closeModal={closeModal}/> }
            { modal.view === "register" && <UserRegisterForm switchTo={setView} /> }
            { modal.view === "forgot-password" && <UserForgotPassword switchTo={setView} />}

          </div>

        </Modal>





    </>
  );
}
