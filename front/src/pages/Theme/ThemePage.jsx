import { useLoaderData } from 'react-router-dom';
import { RoomItem } from '../../components/RoomItem';
import { useEffect } from 'react';
// import { useRenderLogger } from '../../hooks/useRenderLogger';


export async function loader({ params }) {
    const theme = await fetch(`${import.meta.env.VITE_API_URL}/api/theme/${params.id}`).then(response => response.json());
    return {theme};
}




export function ThemePage() {

    // console.log("Render ThemePage");

    const { theme } = useLoaderData();
    console.log(theme);

    useEffect(() => {
      console.log("ThemePage mounted");
      return () => console.log("ThemePage unmounted");
    }, []);
    // useRenderLogger("ThemePage");  
  

  return (
    
    <section className='mt-8'>
        <h2 className='text-2xl'>Theme : {theme.name}</h2>
        <p>Il y a {theme.rooms.length} room(s) correspondant à ce thème.</p>
        <ul className='mt-6 flex flex-col lg:flex-row gap-12 lg:gap-12 items-center md:flex-wrap'>
            
        {/* min-[320px]: */}
        {theme.rooms.map((room) => 
            <li key={room.room_id} className='flex max-[320px]:flex-col min-[300px]:gap-y-4 sm:flex-row items-center gap-x-5'>
                       
            <RoomItem key={room.room_id} room = {room} />
            

            </li>
        )}
        

        </ul>
    </section>
  )
}
