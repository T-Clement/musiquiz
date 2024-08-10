import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from './pages/ErrorPage';
import { DefaultLayout } from './layouts/DefaultLayout';
import { WaitingRoom } from './pages/WaitingRoom';
import { HomePage, loader as homeLoader } from './pages/Home/HomePage';
import { RoomPage, loader as roomPageLoader } from './pages/Room/RoomPage';
import { Page404 } from './pages/Page404';


export function App() {

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
          path : "*", 
          element: <Page404 />
        }
      ]
    }
  ])

  return <RouterProvider router = {router} />
}

