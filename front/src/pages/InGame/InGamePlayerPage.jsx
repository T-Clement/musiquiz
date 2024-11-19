import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
import { useWebSocket } from '../../layouts/GameLayout';
import Spinner from '../../components/Spinner';

export default function InGamePlayerPage() {
  const { id: gameId } = useParams();
  const socket = useWebSocket();

  const {role, setRole} = useOutletContext();

  const [currentRound, setCurrentRound] = useState(null);
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


  const submitAnswer = (choice) => {
    socket.emit('submit-answer', {
      gameId,
      roundIndex: currentRound,
      choice
    });
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

        <button onClick={() => submitAnswer(1)}>Choix 1</button>
        <button onClick={() => submitAnswer(2)}>Choix 2</button>
        <button onClick={() => submitAnswer(3)}>Choix 3</button>
        <button onClick={() => submitAnswer(4)}>Choix 4</button>

      </div>

    </div>
  )
}
