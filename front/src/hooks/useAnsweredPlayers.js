import { useState, useEffect, useRef } from 'react';

export function useAnsweredPlayers(socket, currentRound) {
  const [answeredSet, setAnsweredSet] = useState(new Set());
  const timeouts = useRef({});

  // reset at each round update / change
  useEffect(() => {
    setAnsweredSet(new Set());
    Object.values(timeouts.current).forEach(clearTimeout);
    timeouts.current = {};
  }, [currentRound]);

  // listener of the socket event
  useEffect(() => {
    if (!socket) return;
    const onAnswer = ({ userId }) => {
      setAnsweredSet(prev => {
        if (prev.has(userId)) return prev;
        const next = new Set(prev);
        next.add(userId);
        return next;
      });
    };
    socket.on('player-answered', onAnswer);
    return () => {
      socket.off('player-answered', onAnswer);
      Object.values(timeouts.current).forEach(clearTimeout);
      timeouts.current = {};
    };
  }, [socket]);

  return { answeredSet };
}
