import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
import { useWebSocket } from '../../layouts/GameLayout';
import Spinner from '../../components/Spinner';
import { AuthContext } from '../../hooks/authContext';

export default function InGamePlayerPage() {
  const { id: gameId } = useParams();


  const user = useContext(AuthContext);
  const userId = user.user.user.userId;


  const socket = useWebSocket();

  const { role, setRole } = useOutletContext();


  // LOCAL STATES
  const [currentRound, setCurrentRound] = useState(null);
  const [roundChoices, setRoundChoices] = useState(null);
  const [choiceIsSubmited, setChoiceIsSubmited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    // // listen for beginning of round
    // socket.on('start-round', ({ roundIndex }) => {

    //   setCurrentRound(roundIndex);

    //   // set choices

    // });
    // // cleanup listeners
    // return () => {
    //   socket.off('start-round');
    // };
  }, [socket]);



  useEffect(() => {

    // get round data when preparation event is received
    socket.on('prepare-round', ({roundNumber, roundData}) => {
      setCurrentRound(roundNumber);
      setRoundChoices(roundData.choices);



      socket.emit('player-ready', {
        gameId,
        userId: userId,
        roundNumber
      })


    });




    // get event of beginning of round
    socket.on('start-round-player', ({roundNumber}) => {
      if(roundNumber === currentRound) {
        setIsLoading(false);
      }
    });




    // socket.on("load-round-choices", (data) => {

    //   setRoundChoices(data.choices);

    //   // send to server that player is ready
    //   socket.emit("player-ready", { gameId, playerSocketId: socket.id });


    // });


    return () => {
      // socket.off('load-round-choices');
      socket.off('prepare-round');
      socket.off('start-round');

    };






  }, [socket, currentRound]);


  const submitAnswer = (choiceId) => {
    socket.emit('submit-answer', {
      gameId,
      userId: userId,
      roundNumber: currentRound,
      choiceId
    });

    setChoiceIsSubmited(true);

  }


  if (isLoading) {
    return (
      <div className='flex flex-col items-center gap-4 mt-6'>
        <Spinner />
        <p>Le présentateur va lancer la partie sous peu !</p>
        <p>Socket: {socket.id}</p>

      </div>
    )
  }



  return (
    <div>
      <p>InGamePlayerPage</p>

      <p>Round {currentRound + 1}</p>

      <div className=''>


        {
          roundChoices.map(choice =>
          (
            <button onClick={() => submitAnswer(choice.choiceId)}>
              {choice.artistName} - {choice.songName}
            </button>
          )
          )
        }


      </div>

    </div>
  )
}
