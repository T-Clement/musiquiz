import React, { useContext, useEffect } from 'react'
import { useFetcher } from 'react-router-dom'
import { AuthContext } from '../../App';

export function action () {

    return null;
}


export default function Logout() {

    // const fetcher = useFetcher();
    const { setUser } = useContext(AuthContext);
  
    // useEffect(() => {

    //   console.log("fetcher state:", fetcher.state);
    //   console.log("fetcher type:", fetcher.type);
    //   console.log("fetcher data:", fetcher.data);
    // //   if (fetcher.state === 'idle' && fetcher.type === 'done' && !fetcher.data) {
    // //     console.log("dans le if");
    // //     setUser(null);
    // // }
    //   if (fetcher.state === 'idle') {
    //     console.log("dans le if");
    //     setUser(null);
    // }
    // }, [fetcher.state, fetcher.type, fetcher.data, setUser]);
  

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setUser(null);
    //     fetcher.submit(e.currentTarget);
    // }
    const handleSubmit = (e) => {
        e.preventDefault();
        setUser(null);
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
