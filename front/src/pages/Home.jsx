import React, { useState } from 'react'
import { Router, useNavigate } from 'react-router-dom';
import { checkIfRoomExists } from '../rooms';
import Tab from '../components/Tab'; 

function Home() {

  const [tabSelected, setTabSelected] = useState("Code");
  const [roomCode, setRoomCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");



  const navigate = useNavigate();

  const handleChange = (e) => setRoomCode(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Go to room with id : ")
    console.log(roomCode);



    const room = await checkIfRoomExists(roomCode);
    console.warn(room);
    if(room) {
      navigate(`/waiting-room/${roomCode}`, { state : { room } });
    } else {
      setErrorMessage("Aucune salle n'a été trouvée avec cet identifiant.");
    }




    // Loader 

    // if no current room at this id -> show error message
    
    // else if current room at this id -> navigate to it

    
    // check if room exists -> API

    //


  }

  return (
    <div>

      <h2>Rejoindre une partie</h2>

      <div>
        <Tab title="Code" setActiveTab={ () => setTabSelected("Code") } isActive={tabSelected === "Code"} />
        <Tab title="QrCode" setActiveTab={ () => setTabSelected("QrCode") } isActive={tabSelected === "QrCode"} />
      </div>


      <div>
        {/* { tabSelected === "Code" && <JoinRoomSearchInput />}
        { tabSelected === "QrCode" && <JoinRoomQrCode />} */}
      </div>

      <form action='' method='' onSubmit={handleSubmit}> 
        <input type="search" name="roomCode" onChange={handleChange}/>
        <input type='submit' value="Rejoindre"/>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}

export default Home