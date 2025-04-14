import React from 'react'
import apiAxios from '../libs/axios'
import { useLoaderData } from 'react-router-dom';


export async function loader({request, params}) {
    const userData = await apiAxios(
        `${import.meta.env.VITE_API_URL}/api/user/${params.id}`
    ).then((response) => response.data);
    return { userData };
}


export default function UserPage() {

    const { userData } = useLoaderData();
    // console.log(userData);

  return (
    <div>
        <p>Page du compte de {userData.pseudo}</p>
        <p>Compte créé le { userData.createdAt != null ? userData.createdAt : "information non disponibe" }</p>
    </div>
  )
}
