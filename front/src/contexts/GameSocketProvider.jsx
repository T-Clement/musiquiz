import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../layouts/GameLayout";

const GameSocketContext = createContext();

export default function GameSocketProvider({gameId, children}) {
  const { socket, isSocketReady } = useWebSocket();
  const [players, setPlayers] = useState([]);
  const [roundData, setRoundData] = useState({
    currentRound: 1,
    roundsNumber: null,
    audioUrl: null,
    roundInProgress: false,
    isRoundOver: false,
    correctAnswer: null,
    timeLeft: 30,
  });

  useEffect(() => {
    if (!isSocketReady) return;
    const socketInstance = socket.current;

    // -------------------------
    // HANDLERS
    // -------------------------
    const handleRoomPlayersList = (playersList) => {
      console.log("Received players list: ", playersList);
      setPlayers(playersList);
    };

    const handleRoundLoading = (data) => {
      console.warn("Round is loading", data);
      setRoundData((prev) => ({
        ...prev,
        currentRound: data.roundNumber,
        roundsNumber: data.totalRounds,
        audioUrl: data.extractUrl,
        roundInProgress: false,
        isRoundOver: false,
      }));
      
    };

    const handleRoundStarted = (data) => {
      console.log("Round just started", data);
      setRoundData((prev) => ({
        ...prev,
        roundInProgress: true,
        isRoundOver: false,
        timeLeft: data.roundDuration || 30,
        correctAnswer: null,
      }));
    };

    const handleRoundResults = (resultsData) => {
      console.log("Round results received", resultsData);
      setRoundData((prev) => ({
        ...prev,
        correctAnswer: resultsData.correctAnswer,
        isRoundOver: true,
      }));
      if(resultsData.updatedPlayers) {
        setPlayers(resultsData.updatedPlayers);
      }
    };

    // attach events
    socketInstance.on("room-players-list", handleRoomPlayersList);
    socketInstance.on("round-loading", handleRoundLoading);
    socketInstance.on("round-started", handleRoundStarted);
    socketInstance.on("round-results", handleRoundResults);

    // cleanup functions
    return () => {
      socketInstance.off("room-players-list", handleRoomPlayersList);
      socketInstance.off("round-loading", handleRoundLoading);
      socketInstance.off("round-started", handleRoundStarted);
      socketInstance.off("round-results", handleRoundResults);
    };
  }, [isSocketReady, gameId, socket]);

  return (
    <GameSocketContext.Provider value={{ players, roundData }}>
        {children}
    </GameSocketContext.Provider>
  )
}


export function useGameSocketContext() {
    return useContext(GameSocketContext);
}