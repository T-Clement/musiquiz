import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from './pages/ErrorPage';
import {DefaultLayout} from './layouts/DefaultLayout';
import {WaitingRoom} from './pages/WaitingRoom';
import {HomePage} from './pages/Home/HomePage';
import { RoomPage } from './pages/Room/RoomPage';


export function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true, 
          element: <HomePage />
        },
        {
          path: "room/:id",
          element: <RoomPage />
        },
        {
          path: "waiting-room/:id",
          element: <WaitingRoom />
        }
      ]
    }
  ])

  return <RouterProvider router = {router} />
}

