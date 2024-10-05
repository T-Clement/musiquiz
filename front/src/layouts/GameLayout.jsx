import { useContext, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../hooks/authContext';

export function GameLayout() {


    // websocket connection here


  const { user, setUser, loading } = useContext(AuthContext);



  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
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