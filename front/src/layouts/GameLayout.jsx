import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { AuthContext } from '../hooks/authContext';
import { io } from 'socket.io-client';
import axios from 'axios';



// create websocket context
const WebSocketContext = createContext();



export default function GameLayout() {

  console.log("Render Game Layout");
  // check if game passed in GET request exists
  //  --> returns a 404 in waiting-room



  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();


  const { id: gameId } = useParams();


  const socketRef = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  // const [socket, setSocket] = useState(null);

  // role to in childrens components
  const [role, setRole] = useState(null);




  useEffect(() => {


    if (loading) return;


    // const socketInstance = io('http://localhost:3000');
    // const socketInstance = io('http://192.168.1.26:3000');
    // const socketInstance = io('http://192.168.2.113:3000');
    const socketInstance = io(import.meta.env.VITE_API_URL);





    socketInstance.on('connect', () => {
      console.log("Connected with socket id :", socketInstance.id);
      // update state
      // setSocket(socketInstance);
      socketRef.current = socketInstance;
      setIsSocketReady(true);
    })


    // quit gameLayout view and redirect to home
    socketInstance.on('quit-game', (message) => {
      console.warn(message);
      navigate("/");
    })

    //    
    socketInstance.on("game-started", (data) => {
      navigate(`/game/${gameId}/play/${data.role}`)
    })


    return () => {
      socketInstance.off("connect");
      socketInstance.off("quit-game");
      socketInstance.off("game-started");
      socketInstance.disconnect();
    }


  }, [navigate, loading, gameId]);


  const handleDeleteGame = async () => {
    // console.log("test")
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/game/${gameId}/delete`, {}, {
      headers:
      {
        "Content-Type": "application/json"
      }
    }
    );

    console.log(response);
    if (response.data) {


      // emit delete event to redirect all other users
      // socket.emit('delete-game', gameId);
      socketRef.current.emit('delete-game', gameId);


      // navigate to home
      navigate(`/`);

    }



  }






  if (loading) {
    return <div>Loading in GameLayout...</div>;
  }

  return (
    // <WebSocketContext.Provider value={socket}>
    <WebSocketContext.Provider value={{socket: socketRef, isSocketReady}}>
      {/* maybe issue for presentator if height is full screen */}
      <div className="game-layout h-screen md:h-full">
        <p>GameLayout</p>
        <div className='mx-auto flex items-center justify-center'>
          <button
            className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
            type='button'
            onClick={handleDeleteGame}
          >
            Supprimer la partie
          </button>
        </div>
        <Outlet context={{role, setRole}} />
      </div>
    </WebSocketContext.Provider>
  );
}


export function useWebSocket() {
  // return useContext(WebSocketContext);
  return useContext(WebSocketContext);
}