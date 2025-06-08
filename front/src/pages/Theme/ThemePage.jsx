import { useLoaderData } from 'react-router-dom';
import { RoomItem } from '../../components/RoomItem';
import { useEffect } from 'react';
import Heading2 from '../../components/Heading2';
import Separator from '../../components/Separator';
import SubHeading2 from '../../components/SubHeading2';
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
    
    <section className='mt-8 mx-1'>
        <Heading2>Theme : {theme.name}</Heading2>
        <Separator/>
        <SubHeading2>Il y a {theme.rooms.length} room(s) correspondant à ce thème.</SubHeading2>


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
