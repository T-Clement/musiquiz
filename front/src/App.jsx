import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from './pages/ErrorPage';
import { DefaultLayout } from './layouts/DefaultLayout';
import { WaitingRoom } from './pages/WaitingRoom';
import { HomePage, loader as homeLoader } from './pages/Home/HomePage';
import { RoomPage, loader as roomPageLoader } from './pages/Room/RoomPage';
import { Page404 } from './pages/Page404';
import { ThemePage, loader as themePageLoader } from './pages/Theme/ThemePage';
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
          path: "login",
          action: 
            async ({request}) => {
              const formData = await request.formData();
              const email = formData.get("email");
              const password = formData.get("password");

              // call to api
              const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              });

              if (!response.ok) {
                // handle login error
                return { error: 'Échec de la connexion' };
              }

              const userData = await response.json();
              console.log(userData);
              // Mettre à jour l'UI ou rediriger l'utilisateur
              return { user: userData };

            } 
          
        },
        {
          path : "*", 
          element: <Page404 />
        }
      ]
    }
  ])

  return <AuthContext.Provider value = { user }>
            <RouterProvider router = {router} />
          </AuthContext.Provider>
//   <RouterProvider
//   router={Router}
//   fallbackElement={
//    <YourLoadingComponent/>
//   }
// />
}

