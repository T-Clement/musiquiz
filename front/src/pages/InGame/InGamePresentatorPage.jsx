import React, { useEffect, useState } from 'react'
import { useWebSocket } from '../../layouts/GameLayout';
import { useOutletContext, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';



export default function InGamePresentatorPage() {



  const { id: gameId } = useParams();
  const socket = useWebSocket();

  const { role, setRole } = useOutletContext();


  // -------------------------------------------
  // STATES
  // -------------------------------------------
  const [audioElements, setAudioElements] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [roundsNumber, setRoundsNumber] = useState(null);

  
  const [isLoading, setIsLoading] = useState(true);
  const [playersReady, setPlayersReady] = useState(false);
  
  // to display scoreboard
  const [players, setPlayers] = useState(null);







  // load music extract
  useEffect(() => {
    // get music extracts

    // setMusicExtracts(data.extracts);
  }, [gameId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('request-extracts', {
      gameId,
      currentRound
    });

    //
    socket.on('receive-extracts', data => {
      //
      setRoundsNumber(data.totalRounds);


      // preload audio extracts ???
      const audios = data.rounds.map(extract => {
        const audio = new Audio(extract.audioPreviewUrl);
        audio.load();
        return audio
      });

      // only audio elements
      setAudioElements(audios);
      setRounds(data.rounds);
      setIsLoading(false);

    });


    // listen to all players are ready
    socket.on('all-players-ready', () => {
      setPlayersReady(true);
    })





    return () => {
      socket.off('receive-extracts');
      socket.off('all-players-ready');
    };





  }, [socket, gameId]);


  const prepareRound = () => {
    socket.emit('prepare-round-presentator', {
      gameId,
      // roundData: rounds[currentRound],
      roundNumber: currentRound
    });

    setPlayersReady(false);


    // socket.emit('presentator-ready', {gameId, round: currentRound});


  }



  const startRound = () => {

    // handle not all players are ready
    if (!playersReady) {
      console.log("Les joueurs ne sont pas tous prêts");
      return;
    }

    console.log("round started");

    // play audio extract
    audioElements[currentRound].play();

    // send event to players clients
    socket.emit('start-round', {
      gameId, 
      roundNumber: currentRound
    });


    // pass to next round
    setCurrentRound(prev => prev + 1);
    // setPlayersReady(false);
  }








  console.log(rounds);

  return (
    <div>


      <p>InGamePresentatorPage</p>
      <p>Socket: {socket.id}</p>
      <p>Role: {role}</p>

      <p>{roundsNumber} extraits sont prévus</p>


      <button
        className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
        onClick={prepareRound}
        disabled={isLoading || currentRound >= roundsNumber}
      >
        Préparer le round {currentRound}
      </button>



      <button
        className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
        onClick={startRound}
        disabled={!playersReady}
      >
        Lancer le round {currentRound}
      </button>



      {/* <button className='flex items-center gap-3 m-0 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
        onClick={() => startRound(currentRound)}
      >
        {isLoading ? <><Spinner /><span>Chargement du round</span></> : `Lancer le round ${currentRound}`}
      </button> */}

      <ul>
        {
          rounds.map((round, index) => (
            <li>
              <p>Round n°{index} - {round.correctAnswer} ({"roundId : " + round.roundId})</p>
              {/* <button onClick={() => handleClick(gameId, round.roundId, index)}>Test Round</button> */}
            </li>

          ))
        }
      </ul>



    </div>
  )
}
