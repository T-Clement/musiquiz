import { useState, useEffect } from 'react';

export function useAnsweredPlayers(socket, currentRound) {
  const [answeredSet, setAnsweredSet] = useState(new Set());

  // reset at each round update / change
  useEffect(() => {
    setAnsweredSet(new Set());
  }, [currentRound]);

  // listener of the socket event
  useEffect(() => {
    if (!socket) return;
    socket.on('player-answered', onAnswer);
    return () => {
      socket.off('player-answered', onAnswer);
    };
  }, [socket]);
  
  const onAnswer = ({ userId }) => {
    setAnsweredSet(prev => {
      if (prev.has(userId)) return prev;
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
  };

  return { answeredSet };
}
