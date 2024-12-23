import React, { useEffect, useState } from 'react'
import { useWebSocket } from '../../layouts/GameLayout';
import { useOutletContext, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import LeaderBoard from './LeaderBoard';

import { CountdownCircleTimer } from 'react-countdown-circle-timer'




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
  const [players, setPlayers] = useState([]);







  // load music extract
  useEffect(() => {
    // get music extracts

    // setMusicExtracts(data.extracts);
  }, [gameId]);

  useEffect(() => {
    if (!socket) return;


    socket.emit('get-room-players', gameId);

    socket.on('room-players-list', (players) => {
      setPlayers(players);
    })

    // socket.emit('get-room-sockets', gameId);

    // socket.on('room-sockets-list', (sockets) => {
    //   // setPlayers(sockets);
    //   console.log("Liste des sockets connectées à la room", sockets);
    // })





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
      socket.off('room-sockets-list');
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







  console.log(players);
  console.log(rounds);
  // return;

  return (
    <div>


      <p>InGamePresentatorPage</p>
      <p>Socket: {socket.id}</p>
      <p>Role: {role}</p>

      <p className='text-center mb-10'>{roundsNumber} extraits sont prévus</p>
      <p className='text-center mb-20'><span className='bg-white text-black rounded-md p-4'>Round {currentRound}</span></p>

      {/*  */}
      <div className='flex justify-around'>

        {/* Left */}
        <div className='relative p-10 '>

          <LeaderBoard players={players} />

        </div>

        {/* Right */}
        <div>
          <button
            className='focus:outline-none text-white bg-green-700 disabled:opacity-75 disabled:cursor-not-allowed hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
            onClick={prepareRound}
            disabled={isLoading || currentRound >= roundsNumber}
          >
            Préparer le round {currentRound}
          </button>



          <button
            className='focus:outline-none text-white bg-green-700 disabled:opacity-75 disabled:cursor-not-allowed  hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
            onClick={startRound}
            disabled={!playersReady}
          >
            Lancer le round {currentRound}
          </button>



          <ul>
            {
              rounds.map((round, index) => (
                <li key={round.roundId}>
                  <p>Round n°{index} - {round.correctAnswer} ({"roundId : " + round.roundId})</p>
                  {/* <button onClick={() => handleClick(gameId, round.roundId, index)}>Test Round</button> */}
                </li>

              ))
            }
          </ul>


          <div>
            <CountdownCircleTimer
              isPlaying
              duration={7}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[7, 5, 2, 0]}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </div>




        </div>



      </div>





    </div>
  )
}
