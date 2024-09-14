import React, { useContext, useEffect } from 'react'
// import { useFetcher } from 'react-router-dom'
// import { AuthContext } from '../../App';

export function action () {

    return null;
}


export default function Logout({setIsLoggedIn, user}) {

    // const { setUser } = useContext(AuthContext);
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // setIsLoggedIn(false);
        // setUser(null);
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
