import React, { useEffect, useState } from 'react'
import { useWebSocket } from '../../layouts/GameLayout';
import { useOutletContext, useParams } from 'react-router-dom';


// export function loader() {

// }


export default function InGamePresentatorPage() {

  const {id : gameId} = useParams();
  const socket = useWebSocket();
  
  const {role, setRole} = useOutletContext();

  const [musicExtracts, setMusicExtracts] = useState([]);
  const [audioElements, setAudioElements] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);

  // load music extract
  useEffect(() => {
    // get music extracts

    // setMusicExtracts(data.extracts);
  }, [gameId]);


  // pre-load Audio Objects for them to be ready at just before launch of game
  useEffect(() => {
    // const audios = musicExtracts.map(extract => {
    //   const audio = new Audio(extract.previewUrl)
    //   audio.load();
    //   return audio;
    // });
    // setAudioElements(audios);
  }, [musicExtracts]);



  const startRound = () => {
    socket.emit('start-round', {
      gameId,
      roundIndex: currentRound
    })


    // play audio extract
    audioElements[currentRound].play();


    // go to nex round



  }


  return (
    <div>


      <p>InGamePresentatorPage</p>
      <p>Socket: {socket.id}</p>
      <p>Role: {role}</p>

      <button onClick={() => startRound}>Lancer le Round</button>


    </div>
  )
}
