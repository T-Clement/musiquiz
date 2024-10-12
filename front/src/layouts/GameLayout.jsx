import { useContext, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../hooks/authContext';
import { io } from 'socket.io-client';

export function GameLayout() {


  // check if game passed in GET request exists
      //  --> returns a 404 in waiting-room
    
    
    
  // websocket connection here



  
  const { user, setUser, loading } = useContext(AuthContext);



  const navigate = useNavigate();

  const {state} = useLocation();
  // console.warn("Ca MARCHE ???", state);

  useEffect(() => {
    // if (!loading && !user) {
    // if (!loading && !user) {
    //   navigate('/', { replace: true });
    // }

    if(loading || !user) return;

    const socket = io('http://localhost:3000');

    // socket.

    console.log(state.gameId, user??user.user.userId, user??user, socket, role);
    socket.emit('join-room', state.gameId, user.user.userId, socket.id);

    return () => {
      socket.disconnect();
    }


  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-layout">
        <p>GameLayout</p>

      <Outlet />
    </div>
  );
}