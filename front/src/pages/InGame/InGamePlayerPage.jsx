import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useWebSocket } from '../../layouts/GameLayout';

export default function InGamePlayerPage() {
  const { id: gameId } = useParams();
  const socket = useWebSocket();
  const [currentRound, setCurrentRound] = useState(null);
  const [choiceIsSubmited, setChoiceIsSubmited] = useState(false);


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




  return (
    <div>
      <p>InGamePlayerPage</p>

      <p>Round {currentRound + 1}</p>

    <div className=''>
      
      <button onClick={()=>submitAnswer(1)}>Choix 1</button>
      <button onClick={()=>submitAnswer(2)}>Choix 2</button>
      <button onClick={()=>submitAnswer(3)}>Choix 3</button>
      <button onClick={()=>submitAnswer(4)}>Choix 4</button>

    </div>

    </div>
  )
}
