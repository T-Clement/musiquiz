import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import { AuthContext } from "../hooks/authContext";
import { io } from "socket.io-client";
import axios from "axios";
import GameSocketProvider from "../contexts/GameSocketProvider";

import Button from "../components/Button";

// create websocket context
const WebSocketContext = createContext();

export default function GameLayout() {
  console.log("Render GameLayout");
  // const { user, setUser, loading } = useContext(AuthContext);
  const { loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { id: gameId } = useParams();

  const socketRef = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [role, setRole] = useState(null);

  const [showDeleteButton, setShowDeleteButton] = useState(true);


  useEffect(() => {
    if (loading) return;

    const socketInstance = io(import.meta.env.VITE_API_URL);

    socketInstance.on("connect", () => {
      console.log("Connected with socket id :", socketInstance.id);
      // update ref
      socketRef.current = socketInstance;
      setIsSocketReady(true);
    });

    // quit gameLayout view and redirect to home
    socketInstance.on("quit-game", (message) => {
      console.warn(message);
      navigate("/");
    });

    //
    socketInstance.on("game-started", (data) => {
      navigate(`/game/${gameId}/play/${data.role}`);
    });

    socketInstance.on("game-ended", (data) => {
      // remove delete button from layout display
      setShowDeleteButton(false);

      navigate(`/game/${gameId}/leaderboard`, {
        state: {
          scores: data.scores,
          roomName: data.roomName,
          tracks: data.tracks,
        },
      });

    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("quit-game");
      socketInstance.off("game-started");
      socketInstance.off("game-ended");
      socketInstance.disconnect();
    };
  }, [navigate, loading, gameId]);

  const handleDeleteGame = async () => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/game/${gameId}/delete`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);
    if (response.data) {
      // emit delete event to redirect all other users
      socketRef.current.emit("delete-game", gameId);
      // navigate to home
      navigate(`/`);
    }
  };

  if (loading) {
    return <div>Loading in GameLayout...</div>;
  }

  return (
    <WebSocketContext.Provider value={{ socket: socketRef, isSocketReady }}>
      {/* maybe issue for presentator if height is full screen */}
      <GameSocketProvider gameId={gameId}>
          <div className="game-layout h-screen md:h-full">
            <p>GameLayout</p>
            <div className="mx-auto flex items-center justify-center">
              
            {showDeleteButton 
            && 
            <Button onClick={handleDeleteGame} variant="danger">
                Supprimer la partie
            </Button>
            }

            </div>
            <Outlet context={{ role, setRole, setShowDeleteButton}} />
          </div>
      </GameSocketProvider>
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket need to be used in GameLayout provider");
  }
  return context;
}
