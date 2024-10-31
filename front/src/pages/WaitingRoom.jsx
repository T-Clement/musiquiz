import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Navigate, useLoaderData, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useWebSocket } from '../layouts/GameLayout';





export async function loader({params}) {
  const {id} = params;
  console.log("id:", id);
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


  const socket = useWebSocket();
  const { game } = useLoaderData();
  const { state } = useLocation();
  const { userId, pseudo, role } = state;
  const [players, setPlayers] = useState(game.players || []);
  const [presentator, setPresentator] = useState(game.presentator || null);


  const { id: gameId } = useParams();

  console.log("gameId :", gameId)


  const navigate = useNavigate();


  console.log("User role : " ,role);
  //



  // CHANGE LAYOUT !!!!
  // IF ARRIVED HERE, PLAYER IS A USER 
  // OR NOT CONNECTED DEVICE CAN ONLY BE A PRESENTATOR



    // check for {userId: value, websocketId, value} when page connection (connection lost, reload of page, ...)



// console.error(state);



  console.log(game);


  

  useEffect(() => {
    if(socket) {


      // player join room
      socket.on('player-joined', (newPlayer) => {
        console.log("A new player joined the room")
        setPlayers(((prevPlayers) => [...prevPlayers, newPlayer]));
      })

      // player quit room
      socket.on('player-left', (userId) => {
        setPlayers((prevPlayers) => prevPlayers.filter(player => player.userId != userId));
      })


      // presentator join room 
      socket.on("presentator-joined", (newPresentator) => {
        setPresentator(newPresentator);
      })

      // presentator join room
      socket.on('presentator-left', (data) => {
        console.log("presentator left game", data);
        setPresentator(null);
      })


      socket.on('update-players', data => {
        console.log(data); // userId, action properties in object
        if(data.action ==='left') {
          
          setPlayers((prevPlayers) => prevPlayers.filter(player => player.userId !== data.userId));

        }
      })

    }

    return () => {
      if(socket) {
        
        socket.off("player-left");
        socket.off("player-joined");
        socket.off('presentator-joined');
        socket.off('presentator-left');
        socket.off('update-players');
      }
    }

    
  }, [socket, gameId, userId]);

  

  const handleQuitRoom = (userId, role) => {
    console.log("L'utilisateur souhaite quitter la partie");


    if(role === 'player') {
      
      socket.emit('player-left', gameId, userId);

      // optional because where are leaving ???
      setPlayers((prevPlayers) => prevPlayers.filter(player => player.userId !== userId));
      
      navigate('/');
    } 
    
    if(role === 'presentator')  {
      socket.emit('presentator-left', gameId);
      
      
      // optional because where are leaving ???
      setPresentator(null);

      navigate('/');

    }



  }


  
  if (!socket && !players) {
    return <div>Loading in WaitingRoom...</div>;
  }
  
  console.log(players);
  // alert(socket.id);
  // console.log(socket)

  return (
    <>
      <Link to={'/'} className='link'>Go back to Home</Link>
      <div>Welcome to the WaitingRoom !</div>
      <h2>Code pour rejoindre la partie : { game.sharingCode }</h2>


      <h3 className='font-bold'>Role utilisateur: {role}</h3>
      <p>Socket: {socket.id}</p>

{/* AFFICHER de manière distinctive le joueur connecté dans la liste des joueurs de la room */}

      <h2>Joueurs dans la salle :</h2>
      {players && players.length > 0 ? (
        <ul>
          {players.map(player => (
            <li key={player.userId}>{player.pseudo} {player.socketId === socket.id ? "(You)" : ""} - {player.socketId}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun joueur pour le moment</p>
      )}


      <div className='flex gap-2'>
        <h2>Présentateur :</h2>
        <input type='checkbox' checked={presentator != null} readOnly/>
      </div>


      <button 
        type="button" 
        onClick={() =>handleQuitRoom(userId, role)}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Quitter
      </button>


    </>
  )
}
