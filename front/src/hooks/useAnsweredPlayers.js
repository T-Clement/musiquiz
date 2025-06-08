import { useState, useEffect } from 'react';
import { useWebSocket } from '../layouts/GameLayout';

export function useAnsweredPlayers(
  // socket, 
  currentRound) {
  const [answeredSet, setAnsweredSet] = useState(new Set());
  const {socket, isSocketReady} = useWebSocket();
  const socketInstance = socket.current;
  
  // reset at each round update / change
  useEffect(() => {
    setAnsweredSet(new Set());
  }, [currentRound]);
  
  // take the userId from the payload of the event
  // and add it to the answeredSet
  const onAnswer = ({ userId }) => {
    setAnsweredSet(prev => {
      if (prev.has(userId)) return prev;
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
  };
  
   // listener of the socket event
   // server emits 'player-answered' when player answers with his userId as payload
   useEffect(() => {
     if (!socketInstance) return;
     socketInstance.on('player-answered', onAnswer);
     return () => {
       socketInstance.off('player-answered', onAnswer);
     };
  }, [socketInstance, onAnswer]);







  return { answeredSet };
}
