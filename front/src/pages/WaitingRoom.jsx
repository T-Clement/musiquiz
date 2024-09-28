import axios from 'axios';
import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'


// PROTECTED PAGE
// ONLY ACCESSIBLE IF IS CONNCETED / IS AUTH

export async function loader({params}) {
  const {idGame} = params;

  // get data from game in MongoDB database
  const game = await axios.get(`${import.meta.env.VITE_API_URL}/api/game/${idGame}`, {
    headers: {
        "Content-Type": 'application/json'
    }
  });

  if(!game || game.status !== 'waiting') {
    throw new Response('Game not found or not in waiting status', {status: 403});
  }


  return { game };

}





export function WaitingRoom() {

  let { id } = useParams();
  console.log(id);
  // const { state } = useLocation();
  // const { waitingRoomId, roomId, roomName } = state.room;
  // console.log(state);

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
