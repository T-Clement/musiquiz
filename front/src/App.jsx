import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from './pages/ErrorPage';
import { DefaultLayout } from './layouts/DefaultLayout';
import { WaitingRoom } from './pages/WaitingRoom';
import { HomePage, loader as homeLoader } from './pages/Home/HomePage';
import { RoomPage, loader as roomPageLoader } from './pages/Room/RoomPage';
import { Page404 } from './pages/Page404';
import { ThemePage, loader as themePageLoader } from './pages/Theme/ThemePage';
import { action as logoutAction } from './components/Header/Logout';
import { createContext, useState } from 'react';


export const AuthContext = createContext(null);

export function App() {

   const [user, setUser] = useState(null);




  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true, 
          element: <HomePage />,
          loader: homeLoader
        },
        {
          path: "room/:id",
          element: <RoomPage />,
          loader: roomPageLoader
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
  ])

  return <AuthContext.Provider value = { { user, setUser }}>
            <RouterProvider router = {router} />
          </AuthContext.Provider>
//   <RouterProvider
//   router={Router}
//   fallbackElement={
//    <YourLoadingComponent/>
//   }
// />
}

