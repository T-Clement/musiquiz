import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useLocation, useParams } from 'react-router-dom'





export async function loader({params}) {
  const {id} = params;

  // get data from game in MongoDB database
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/game/${id}`, {
    headers: {
        "Content-Type": 'application/json'
    }
  });


  if(!response || response.data.game.status !== 'waiting') {
    throw new Response('Game not found or not in waiting status', {status: 404});
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
console.error(state);



  const { game } = useLoaderData();
  console.log(game);


  const [players, setPlayers] = useState([]);
  
  const [socketId, setSocketId ] = useState(null);

  // useEffect(() => {
  //   const socket = io('http://localhost:3000');

  //   socket.emit('join-room', game._id, userId, socket.id ); /// gameId, userId, socketId
                                                             
  //   socket.on('update-players', (newPlayer) => {
  //     console.log("in update-players");
  //     console.warn(newPlayer);
  //     setPlayers(prevPlayers => [...prevPlayers, newPlayer]); 

  //     setSocketId(newPlayer.socketId);

  //   });

  //   console.log(players);

  //   // cleanup function
  //   return () => {
  //     socket.disconnect();
  //   }

  // }, [game.idGame]);


  // console.warn(waitingRoomId);

  return (
    <>
      <Link to={'/'} className='link'>Go back to Home</Link>
      <div>Welcome to the WaitingRoom !</div>
      <h2>Code pour rejoindre la partie : { game.sharingCode }</h2>
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
            <li key={player.userId}>{player.pseudo} {player.socketId === socketId ? "(You)" : ""}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun joueur pour le moment</p>
      )}



      <h2>Présentateur :</h2>
      <input type='checkbox' 
      />




    </>
  )
}
