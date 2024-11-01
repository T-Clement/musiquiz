import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { AuthContext } from '../hooks/authContext';
import { io } from 'socket.io-client';
import axios from 'axios';



// create websocket context
const WebSocketContext = createContext();



export function GameLayout() {

  console.log("Render Game Layout");
  // check if game passed in GET request exists
  //  --> returns a 404 in waiting-room




  // websocket connection here




  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();


  const { id: gameId } = useParams();


  const [socket, setSocket] = useState(null);



  // console.warn("Ca MARCHE ???", state);

  useEffect(() => {
    // if (!loading && !user) {
    // if (!loading && !user) {
    //   navigate('/', { replace: true });
    // }

    // if(loading || !user) return;

    if (loading) return;


    const socket = io('http://localhost:3000');





    socket.on('connect', () => {
      console.log("Connected with socket id :", socket.id);
      // update state
      setSocket(socket);
    })


    // console.log(state.gameId, user??user.user.userId, user??user, socket, role);

    // socket.emit('join-room', gameId, user.user.userId, socket.id);


    // quit gameLayout view and redirect to home
    socket.on('quit-game', (message) => {
      console.warn(message);
      navigate("/");
    })



    return () => {
      socket.off("connect");
      socket.off("quit-game");
      socket.disconnect();
    }


  }, [navigate]);


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
      socket.emit('delete-game', gameId);


      // navigate to home
      navigate(`/`);

    }



  }






  if (loading) {
    return <div>Loading in GameLayout...</div>;
  }

  return (
    <WebSocketContext.Provider value={socket}>
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
        <Outlet />
      </div>
    </WebSocketContext.Provider>
  );
}


export function useWebSocket() {
  return useContext(WebSocketContext);
}