import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from './pages/ErrorPage';
import {DefaultLayout} from './layouts/DefaultLayout';
import {WaitingRoom} from './pages/WaitingRoom';
import {HomePage} from './pages/Home/HomePage';


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
          path: "waiting-room/:id",
          element: <WaitingRoom />
        }
      ]
    }
  ])

  return <RouterProvider router = {router} />
}

