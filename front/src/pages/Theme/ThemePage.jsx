import React from 'react'
import { useLoaderData } from 'react-router-dom';


export async function loader({requset, params}) {
    const theme = await fetch(`http://localhost:3000/api/theme/${params.id}`).then(response => response.json());
    return {theme};
}




export function ThemePage() {

    const { theme } = useLoaderData();
    console.log(theme);



  return (
    <div>ThemePage</div>
  )
}
