import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import { AuthContext } from '../hooks/authContext';

export function DefaultLayout() {




  console.log("render Default Layout");


  const { user, setUser, loading } = useContext(AuthContext);

  if(loading) {
    return <div>Chargement ...</div>
  }



  return (
    <>
    <Header user={user} setUser={setUser}/>
      <p>DefaultLayout</p>
    <Outlet/>
    </>
  )
}
