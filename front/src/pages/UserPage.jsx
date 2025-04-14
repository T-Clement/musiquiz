import React from 'react'
import apiAxios from '../libs/axios'
import { useLoaderData } from 'react-router-dom';


export async function loader({request, params}) {
    const userData = await apiAxios(
        `${import.meta.env.VITE_API_URL}/api/room/${params.id}`
    ).then((response) => response.json());
    return { userData };
}


export default function UserPage() {

    const { userData } = useLoaderData();
    console.log(userData);

  return (
    <div>UserPage</div>
  )
}
