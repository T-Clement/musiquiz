import axios from 'axios';
import React, { useState } from 'react'
import { Link, useLoaderData, useLocation, useParams } from 'react-router-dom'


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


  // CHANGE LAYOUT ???
  // CHANGE LAYOUT ???
  // CHANGE LAYOUT ???
  // CHANGE LAYOUT !!!!
  // IF ARRIVED HERE, PLAYER IS A USER 
  // OR NOT CONNECTED DEVICE CAN ONLY BE A PRESENTATOR



    // check for {userId: value, websocketId, value} when page connection (connection lost, reload of page, ...)


  const { game } = useLoaderData();
  console.log(game);


  const [players, setPlayers] = useState(null);




  // console.warn(waitingRoomId);

  return (
    <>
      <Link to={'/'} className='link'>Home</Link>
      <div>Welcome to the WaitingRoom !</div>
      {/* <div>
        <p>ID : {waitingRoomId}</p>
        <p>RoomID : {roomId}</p>
        <p>Playlist : {roomName}</p>
      </div> */}






    </>
  )
}
