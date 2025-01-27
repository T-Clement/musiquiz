import React, { useContext, useEffect } from 'react'
import apiAxios from '../../libs/axios';
// import { useFetcher } from 'react-router-dom'
// import { AuthContext } from '../../App';

export function action () {

    return null;
}


export default function Logout({setIsLoggedIn, user, setUser}) {

    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        try {

            // api call to reset accessToken and refreshToken cookies to 0
            const response = await apiAxios.post(`${import.meta.env.VITE_API_URL}/api/logout`);

            if(response.status) {
                setIsLoggedIn(false);
                setUser(null);

            }
        } catch(error) {
            console.error("Error during logout : ", error);
        }
        






        console.log(user, 'to deconnect');
    }


  return (
    <>
        <form method="post" onSubmit={handleSubmit}>
            <button type="submit">Déconnexion</button>
        </form>
        {/* <fetcher.Form method="post" action="/user/logout" onSubmit={handleSubmit}>
            <button type="submit">Déconnexion</button>
        </fetcher.Form> */}
    </>
  )
}
