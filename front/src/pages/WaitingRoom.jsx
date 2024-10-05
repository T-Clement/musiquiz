import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useLocation, useParams } from 'react-router-dom'
import io from 'socket.io-client';


// PROTECTED PAGE
// ONLY ACCESSIBLE IF IS CONNCETED / IS AUTH

export async function loader({params}) {
  const {id} = params;

  // get data from game in MongoDB database
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/game/${id}`, {
    headers: {
        "Content-Type": 'application/json'
    }
  });


  if(!response || response.data.game.status !== 'waiting') {
    throw new Response('Game not found or not in waiting status', {status: 403});
  }

  return response.data;

}





export function WaitingRoom() {


  // CHANGE LAYOUT !!!!
  // IF ARRIVED HERE, PLAYER IS A USER 
  // OR NOT CONNECTED DEVICE CAN ONLY BE A PRESENTATOR



    // check for {userId: value, websocketId, value} when page connection (connection lost, reload of page, ...)



  const { state } = useLocation();
  const { userId, pseudo } = state;
// console.log(state);



  const { game } = useLoaderData();
  console.log(game);


  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.emit('join-room', game._id, userId, socket.id ); /// gameId, userId, socketId
                                                              // !!!!!!!!!!
    socket.on('update-players', (newPlayer) => {
      console.log("in update-players");
      console.warn(newPlayer);
      setPlayers(prevPlayers => [...prevPlayers, newPlayer]); // to modify !!!!

    });

    console.log(players);

    // cleanup function
    return () => {
      socket.disconnect();
    }

  }, [game.idGame]);


  // console.warn(waitingRoomId);

  return (
    <>
      <Link to={'/'} className='link'>Go back to Home</Link>
      <div>Welcome to the WaitingRoom !</div>
      {/* <div>
        <p>ID : {waitingRoomId}</p>
        <p>RoomID : {roomId}</p>
        <p>Playlist : {roomName}</p>
      </div> */}


{/* AFFICHER de manière distinctive le joueur connecté dans la liste des joueurs de la room */}

      <h2>Joueurs dans la salle :</h2>
      {players && players.length > 0 ? (
        <ul>
          {players.map(player => (
            <li key={player.userId}>{player.pseudo} (add you)</li>
          ))}
        </ul>
      ) : (
        <p>Aucun joueur pour le moment</p>
      )}






    </>
  )
}
