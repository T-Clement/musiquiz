import React, { useEffect, useState } from 'react'
import Button, { VARIANT_STYLES } from '../../components/Button';
import { RotateCcw } from 'lucide-react'
import axios from 'axios';
import LinkWithViewTransition from '../../components/LinkWithViewTransition';
 
export default function RandomRoomCard({intialRandomRoomsPool = [], onJoin}) {
    
    const [rooms, setRooms] = useState(intialRandomRoomsPool);      // pre fetch a small pool of room to avoid multiple API calls
    // const [current, setCurrent] = useState(intialRandomRoomsPool[0] || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // at each render of component, current is initialize with 
    // first value of rooms
    const current = rooms[0] || null;

    // to fetch a new pool a rooms
    const fetchRooms = async (count = 5) => {
        setLoading(true)
        setError(null)
        try {
            // endpoint example
          const resp = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/room/random`
          );
          
          setRooms(resp.data.rooms);
          // console.log(resp.data.rooms);        
        } catch (err) {
            console.log(err);
          setError("Impossible de charger une room aléatoire.")
        } finally {
          setLoading(false)
        }
      }


      const nextRoom = () => {
        if (rooms.length <= 1) {
          // if no more rooms in in pre fetched stock, reload the api call
          return fetchRooms()
        }
        // remove first element
        setRooms(prev => prev.slice(1));

      }

    

      if (loading) {
        return (
        <div className="p-4 space-y-4">
            <p className="text-gray-400">Chargement…</p>
          </div>
        )
      }
    
      if (error) {
        return (
        <div className="p-4 space-y-4">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => fetchRooms()}>
              Réessayer
            </Button>
          </div>
        )
      }


      if (!current) return null

  return (
    <div className="p-4 space-y-4">

      <h3 className="text-md font-semibold text-white">{current.name}</h3>
      <p className="text-gray-300">
        Thème : <span className="font-medium">{current.theme}</span>
      </p>
      
      <div className="flex justify-center gap-4">
        <LinkWithViewTransition
            className={`${VARIANT_STYLES.blue} transition`}
            to={`/room/${current.id}`}
        >
          Rejoindre
        </LinkWithViewTransition>
        <Button 
            variant="outline" 
            onClick={nextRoom} 
            className='group flex items-center align-middle text gap-2 text-white hover:text-[#1F2144] transition-colors '
        >
            <RotateCcw 
                className="w-5 h-5 group-hover:stroke-[#1F2144] transition-colors"/>
            Relancer
        </Button>
      </div>
    </div>
  )
}
