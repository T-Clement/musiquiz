import React, { useEffect, useState } from 'react'
import { useWebSocket } from '../../layouts/GameLayout';
import { useOutletContext, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';


// export function loader() {

// }


export default function InGamePresentatorPage() {

  const { id: gameId } = useParams();
  const socket = useWebSocket();

  const { role, setRole } = useOutletContext();

  const [musicExtracts, setMusicExtracts] = useState([]);
  const [audioElements, setAudioElements] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  // const {rounds, setRounds, roundsNumber, setRoundsNumber} = useOutletContext();

  const [rounds, setRounds] = useState([]);
  const [roundsNumber, setRoundsNumber] = useState(null);


  // load music extract
  useEffect(() => {
    // get music extracts

    // setMusicExtracts(data.extracts);
  }, [gameId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('request-extracts', gameId);
  }, [socket, gameId]);


  useEffect(() => {
    if (!socket) return;

    const handleReceiveExtracts = (data) => {
      console.log("handleReceiveData");
      console.log(data);

      // setMusicExtracts(data.extracts);

      //
      setRoundsNumber(data.totalRounds);



      const audios = data.rounds.map(extract => {
        const audio = new Audio(extract.audioPreviewUrl);
        audio.load();
        return audio
      });

      // 
      setRounds(data.rounds);

      // only audio elements
      setAudioElements(audios);
      setIsLoading(false);

    };

    socket.on('receive-extracts', handleReceiveExtracts);

    return () => {
      socket.off('receive-extracts', handleReceiveExtracts);
    };
  }, [socket]);


  // pre-load Audio Objects for them to be ready at just before launch of game
  useEffect(() => {

    // socket.on('get-extracts', (data))

    // const audios = musicExtracts.map(extract => {
    //   const audio = new Audio(extract.previewUrl)
    //   audio.load();
    //   return audio;
    // });
    // setAudioElements(audios);
  }, [musicExtracts]);



  const startRound = () => {

    console.log("round started");


    // emit start round to client
    socket.emit('start-round', {
      gameId,
      roundIndex: currentRound
    })


    // play audio extract
    audioElements[currentRound].play();


    // go to nex round


  }
  
  console.log(rounds);

  return (
    <div>


      <p>InGamePresentatorPage</p>
      <p>Socket: {socket.id}</p>
      <p>Role: {role}</p>

      <p>{roundsNumber} extraits sont prévus</p>


      <button className='flex items-center gap-3 m-0 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900' onClick={startRound}>
        {isLoading ? <><Spinner/><span>Chargement du round</span></> : "Lancer le Round"}
        </button>
      
      <ul>
        {rounds.map((round, index) => (<li>Round n°{index + 1} - {round.correctAnswer}</li>))
        }
      </ul>



    </div>
  )
}
