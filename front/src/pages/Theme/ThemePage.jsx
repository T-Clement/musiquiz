import React from 'react'
import { useLoaderData } from 'react-router-dom';
import { RoomItem } from '../../components/RoomItem';


export async function loader({requset, params}) {
    const theme = await fetch(`${import.meta.env.VITE_API_URL}/api/theme/${params.id}`).then(response => response.json());
    return {theme};
}




export function ThemePage() {

    const { theme } = useLoaderData();
    console.log(theme);



  return (
    
    <section className='mt-8'>
        <h2 className='text-2xl'>Theme : {theme.name}</h2>
        <p>Il y a {theme.rooms.length} room(s) correspondant à ce thème.</p>
        <ul className='mt-6 flex flex-col lg:flex-row gap-12 lg:gap-12 items-center md:flex-wrap'>
            
        {/* min-[320px]: */}
        {theme.rooms.map((room, index) => 
            <li key={room.id} className='flex max-[320px]:flex-col min-[300px]:gap-y-4 sm:flex-row items-center gap-x-5'>
                       
            {/* <RoomItem room = {room} /> */}
            

            </li>
        )}
        

        </ul>
    </section>
  )
}
