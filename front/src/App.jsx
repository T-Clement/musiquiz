import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from './pages/ErrorPage';
import { DefaultLayout } from './layouts/DefaultLayout';
import { WaitingRoom, loader as waitingRoomLoader } from './pages/WaitingRoom';
import { HomePage, loader as homeLoader } from './pages/Home/HomePage';
import { RoomPage, loader as roomPageLoader } from './pages/Room/RoomPage';
import { Page404 } from './pages/Page404';
import { ThemePage, loader as themePageLoader } from './pages/Theme/ThemePage';
import { action as logoutAction } from './components/Header/Logout';
import { createContext, useMemo, useState } from 'react';

import { AuthContextProvider } from './hooks/authContext';
import ChooseRole, {loader as ChooseRoleLoader} from './pages/ChooseRole';

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
          path: 'game/:id/choose-role',
          element: <ChooseRole />,
          loader: ChooseRoleLoader
        },
        {
          path: 'game/:id/waiting-room',
          element: <WaitingRoom />,
          loader: waitingRoomLoader
        },
        {
          path: "waiting-room/:id",
          element: <WaitingRoom />
        },
        {
          path: "theme/:id",
          element: <ThemePage />,
          loader: themePageLoader
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

