import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from './pages/ErrorPage';
import { DefaultLayout } from './layouts/DefaultLayout';
import { HomePage, loader as homeLoader } from './pages/Home/HomePage';
import { RoomPage, loader as roomPageLoader } from './pages/Room/RoomPage';
import { Page404 } from './pages/Page404';
import { ThemePage, loader as themePageLoader } from './pages/Theme/ThemePage';
import { action as logoutAction } from './components/Header/Logout';
import { useMemo } from 'react';

import { AuthContextProvider } from './hooks/authContext';

import GameLayout from './layouts/GameLayout';
import ChooseRole, {loader as chooseRoleLoader} from './pages/ChooseRole';
import WaitingRoomPage, { loader as waitingRoomLoader } from './pages/WaitingRoom/WaitingRoomPage';
import InGamePlayerPage from './pages/InGame/InGamePlayerPage';
import InGamePresentatorPage from './pages/InGame/InGamePresentatorPage';
import NewRoomPage from './pages/NewRoom/NewRoomPage';
import PlaygroundPage from './pages/Playground/PlaygroundPage';
import FinalLeaderBoardPage from './pages/InGame/FinalLeaderBoardPage';

// import apiAxios from './libs/axios';

// export const AuthContext = createContext(null);

// async function AppLoader() {
//   try {
//     // const response = await apiAxios.get('/api/me');
  
//     return { user: response.data };

//   } catch (error) {
//     console.error('Error in AppLoader : ', error);
//     return { user: null };

//   }
// }

export function App() {

  //  const [user, setUser] = useState(null);

  console.log("Render App");

  const router = useMemo(() => createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      errorElement: <ErrorPage />,
      // loader: AppLoader,
      children: [
        {
          index: true, 
          element: <HomePage />,
          loader: homeLoader,
          // shouldRevalidate: ({currentUrl, nextUrl}) => {
          //   return false;
          // },
        },
        {
          path: "room/:id",
          element: <RoomPage />,
          loader: roomPageLoader
        },
        {
          path: "room/new",
          element: <NewRoomPage />,
        },
        {
          path: "theme/:id",
          element: <ThemePage />,
          loader: themePageLoader
        },
        {
          path: "playground",
          element: <PlaygroundPage/>
        },
        {
          path : "*", 
          element: <Page404 />
        },
        {
          path: "user/logout",
          action: logoutAction
        }
      ]
    }, 
    {
      path: "/game/",
      element: <GameLayout />,
      errorElement: <ErrorPage />,
      children: [
        // {
        //   path:
        // },
        {
          path: ":id/choose-role",
          element: <ChooseRole />,
          loader: chooseRoleLoader
        }, 
        {
          path: ":id/waiting-room",
          element: <WaitingRoomPage />,
          loader: waitingRoomLoader
        },
        {
          path: ':id/play/player',
          element: <InGamePlayerPage />
        },
        {
          path: ':id/play/presentator',
          element: <InGamePresentatorPage />
        }, 
        {
          path: ':id/leaderboard',
          element: <FinalLeaderBoardPage />
        }
      ]
    }
  ]), []);

  return <AuthContextProvider><RouterProvider router = {router} fallbackElement={ <div>Loading ...</div> }/></AuthContextProvider>


  // return <AuthContext.Provider value = { { user, setUser }}>
  //           <RouterProvider router = {router} />
  //         </AuthContext.Provider>
//   <RouterProvider
//   router={Router}
//   fallbackElement={
//    <YourLoadingComponent/>
//   }
// />
}

