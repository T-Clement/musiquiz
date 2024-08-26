import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'


// PROTECTED PAGE
// ONLY ACCESSIBLE IF IS CONNCETED / IS AUTH

export function WaitingRoom() {

  let { id } = useParams();
  console.log(id);
  const { state } = useLocation();
  const { waitingRoomId, roomId, roomName } = state.room;
  console.log(state);

  console.warn(waitingRoomId);

  return (
    <>
      <Link to={'/'} className='link'>Home</Link>
      <div>Welcome to the WaitingRoom !</div>
      <div>
        <p>ID : {waitingRoomId}</p>
        <p>RoomID : {roomId}</p>
        <p>Playlist : {roomName}</p>
      </div>
    </>
  )
}
