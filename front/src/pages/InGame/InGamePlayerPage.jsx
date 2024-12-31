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
  const [revealChoices, setRevealChoices] = useState(false);

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
      setRevealChoices(false);


      socket.emit('player-ready', {
        gameId,
        userId: userId,
        roundNumber
      })

      setIsLoading(false);

    });




    // get event of beginning of round
    socket.on('start-round-players', ({roundNumber}) => {
      if(roundNumber === currentRound) {
        setIsLoading(false);
      }
      setRevealChoices(true);
    });





    socket.on("round-loading", (data) => {
      setCurrentRound(data.roundNumber);
      // setIsLoading(true);
    });
    
    
    socket.on('round-started', (data) => {
      setIsLoading(false);
      setRoundChoices(data.choices);
      
    });


    socket.on('round-results', () => {
      setRoundChoices(null); // TODO: see if another way is possible to avoid rerendering of component ..
    });

    // socket.on("load-round-choices", (data) => {

    //   setRoundChoices(data.choices);

    //   // send to server that player is ready
    //   socket.emit("player-ready", { gameId, playerSocketId: socket.id });


    // });


    return () => {
      // socket.off('load-round-choices');
      socket.off('prepare-round');
      socket.off('start-round-player');

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
    setIsLoading(true);
  }


  if (isLoading) {
    return (
      <div className='flex flex-col items-center gap-4 mt-6'>
      <p>Round n° {currentRound}</p>
        <Spinner />
        <p className='text-center'>Le présentateur va lancer le<br/>round, tenez vous prêt !</p>
        <p>Socket: {socket.id}</p>

      </div>
    )
  }


  return (
    <div>


      <div className='flex flex-col items-center mb-20'>
        <p className='my-4'>InGamePlayerPage</p>

        <p className=' p-4 bg-white text-violet-900 rounded-lg text-lg font-bold'>Round {currentRound}</p>

      </div>

      <div className='flex flex-col items-center gap-6'>


        {
          roundChoices.map(choice =>
          (
            <button 
              className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
              key={choice.choicId} 
              onClick={() => submitAnswer(choice.choiceId)}
            >
              <span className="">{choice.artistName} - {choice.title}</span>
            </button>
          )
          )
        }


      </div>

    </div>
  )
}
