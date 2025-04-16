import React from 'react'
import apiAxios from '../libs/axios'
import { useLoaderData } from 'react-router-dom';
import { RoomItem } from '../components/RoomItem';
import Button from '../components/Button';

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
      <div>
          <p>Page du compte de {userData.user.pseudo}</p>
          <p>Compte créé le { userData.user.createdAt != null ? userData.user.createdAt : "information non disponibe" }</p>
      </div>

      <div>
        <h3>Vos dernières parties</h3>

        <div>

          { userData.games.length > 0 ? userData.games.map(game => (
            <div className='my-4'>
              <p>{game.metaData.name}</p>
              <p>{game.game.score} points</p>
              <p><Button variant='info'>Détails</Button></p>
              <p>Date :{game.game.date_score}</p>
            </div>
            ))
            :
            <p>Aucune partie n'a été jouée</p> 
          }


        </div>
      </div>

    </div>
  )
}
