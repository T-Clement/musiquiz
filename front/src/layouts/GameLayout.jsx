import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Outlet, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../hooks/authContext";
import { io } from "socket.io-client";
import axios from "axios";
import GameSocketProvider from "../contexts/GameSocketProvider";

import { AudioContextProvider } from "../contexts/AudioContextProvider";
import Button from "../components/Button";

// create websocket context
const WebSocketContext = createContext();

export default function GameLayout() {
  console.log("Render GameLayout");
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id: gameId } = useParams();

  const socketRef = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (loading) return;

    // const socketInstance = io('http://localhost:3000');
    // const socketInstance = io('http://192.168.1.26:3000');
    // const socketInstance = io('http://192.168.2.113:3000');
    const socketInstance = io(import.meta.env.VITE_API_URL);

    socketInstance.on("connect", () => {
      console.log("Connected with socket id :", socketInstance.id);
      // update state
      // setSocket(socketInstance);
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
      // console.log(data);
      // console.warn("game-layout"  + data.message);

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
    // console.log("test")
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
      // socket.emit('delete-game', gameId);
      socketRef.current.emit("delete-game", gameId);

      // navigate to home
      navigate(`/`);
    }
  };

  if (loading) {
    return <div>Loading in GameLayout...</div>;
  }

  return (
    // <WebSocketContext.Provider value={socket}>
    <WebSocketContext.Provider value={{ socket: socketRef, isSocketReady }}>
      {/* // <WebSocketContext.Provider value={{socket: socketRef}}> */}
      {/* maybe issue for presentator if height is full screen */}
      <GameSocketProvider gameId={gameId}>
        <AudioContextProvider>
          <div className="game-layout h-screen md:h-full">
            <p>GameLayout</p>
            <div className="mx-auto flex items-center justify-center">
              
              <Button onClick={handleDeleteGame} variant="danger">
                Supprimer la partie
              </Button>

            </div>
            <Outlet context={{ role, setRole }} />
          </div>
        </AudioContextProvider>
      </GameSocketProvider>
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  // return useContext(WebSocketContext);
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket need to be used in GameLayout provider");
  }
  return context;
}
