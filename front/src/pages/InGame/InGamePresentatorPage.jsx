import React, { useEffect, useRef, useState } from 'react'
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
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundsNumber, setRoundsNumber] = useState(null);

  // url of extract of currentRound
  const [audioUrl, setAudioUrl] = useState(null);
  // to handle reading of audio
  const audioRef = useRef(null);

  // to show if the round is in "loading state"
  const [isLoading, setIsLoading] = useState(false);


  //
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [isRoundOver, setIsRoundOver] = useState(false);
  // local counter but server is the single source of truth !!!
  const [timeLeft, setTimeLeft] = useState(30);




  useEffect(() => {
    if (!socket) return;

    // when component mounted, ask for players in game / room 
    socket.emit('get-room-players', gameId);

    // handle reception of players in room
    socket.on('room-players-list', (players) => {
      setPlayers(players);
    });



    // server send data of round
    socket.on('round-loading', (data) => {
      setIsRoundOver(false);
      setRoundInProgress(false);
      setIsLoading(false);


      const { roundNumber, totalRounds, extractUrl } = data;
      setCurrentRound(roundNumber);
      setRoundsNumber(totalRounds);
      setAudioUrl(extractUrl);


      // prepare audio locally
      if(audioRef.current) {
        audioRef.current.src = extractUrl;
        audioRef.current.load();
      }


    })





    // server has launched the round, round is officialy started
    socket.on('round-started', (data) => {
      // data: roundDuration ?, ..

      setRoundInProgress(true);
      setIsRoundOver(false);


      // start local counter
      if(data.roundDuration) {
        setTimeLeft(data.roundDuration);
      } else {
        setTimeLeft(30);
      }


      // play audio
      if(audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error(`Error playing audio : ${err}`);
        })
      }

    });



    //
    socket.on('round-results', (resultsData) => {
      // resultsData: correctAnswer, scores, nextRoundNumber, ...
      
      setRoundInProgress(false);
      setIsRoundOver(true);

      // update the leaderboard with new scores of players coming from server
      if(resultsData.updatedPlayers) {
        setPlayers(resultsData.updatedPlayers);
      }


    });

    return () => {
      socket.off('room-players-list');
      socket.off('round-started');
      socket.off('round-results');
      socket.off('round-loading');
    }





  }, [socket, gameId]);

  // ------------------------------------
  // -------- HANDLERS ------------------


  const handleAudioLoaded = () => {
    console.log('Audio loaded, presentator is ready');

    socket.emit("presentator-ready", {
      gameId,
      roundNumber: currentRound
    });
  };







  // console.log(players);
  // console.log(rounds);
  // // return;

  return (
    <div>


      <p>InGamePresentatorPage</p>
      <p>Socket: {socket?.id}</p>
      <p>Role: {role}</p>

      <p className='text-center mb-20'>
        <span className='bg-white text-black rounded-md p-4'>
          Round {currentRound} / {roundsNumber ?? "..."}
        </span>
      </p>




      {/*  */}
      <div className='flex justify-around'>

        {/* Left */}
        <div className='relative p-10 '>

          <LeaderBoard players={players} />

        </div>




        {/* Right */}
        <div>
          
          {/** Audio Ref */}
          <audio ref={audioRef} onCanPlay={handleAudioLoaded} />


          {/** Local counter */}
          <div>
            <CountdownCircleTimer
              isPlaying
              duration={timeLeft}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[timeLeft, timeLeft * 0.7, timeLeft * 0.3, 0]}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </div>




        </div>



      </div>





    </div>
  )
}
