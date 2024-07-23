import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {

  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => setRoomCode(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Go to room with id : " + roomCode);
    navigate(`/waiting-room?id=${roomCode}`);

    // Loader 

    // if no current room at this id -> show error message
    
    // else if current room at this id -> navigate to it

  }

  return (
    <div>
      <form action='' method='' onSubmit={handleSubmit}> 
        <input type="search" name="roomCode" onChange={handleChange}/>
        <input type='submit' value="Rejoindre"/>
      </form>
    </div>
  )
}

export default Home