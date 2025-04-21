import React, { useEffect, useState } from 'react'
import Button, { VARIANT_STYLES } from '../../components/Button';
import { RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom';
 
export default function RandomRoomCard() {
    const [rooms, setRooms] = useState([]);      // pre fetch a small pool of room to avoid multiple API calls
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchRooms = async (count = 5) => {
        setLoading(true)
        setError(null)
        try {
            // endpoint example
        //   const resp = await apiAxios.get(
        //     `${import.meta.env.VITE_API_URL}/api/rooms/random?count=${count}`
        //   )
            const resp = { data : [
                {
                    "id": "abcd1234",
                    "name": "Electro Essentiels",
                    "theme": "Electro",
                  }
            ]}

          setRooms(resp.data)        // resp.data = Array<room>
          setCurrent(resp.data[0])   // on affiche la première
        } catch (err) {
          setError("Impossible de charger une room aléatoire.")
        } finally {
          setLoading(false)
        }
      }


      const nextRoom = () => {
        if (rooms.length <= 1) {
          // Si plus rien en stock, on recharge
          // if no more rooms in in pre fetched stock, reload the api call
          return fetchRooms()
        }
        // remove the first room and take next room
        setRooms(prev => {
          const [, ...rest] = prev
          setCurrent(rest[0])
          return rest
        })
      }

      // on component mount, load the pool
      useEffect(() => {
        fetchRooms()
      }, [])


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
        <Link 
            className={`${VARIANT_STYLES.blue} transition`}
            onClick={() => onJoin(current.id)}
        >
          Rejoindre
        </Link>
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
