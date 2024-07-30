import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import DefaultLayout from './layouts/DefaultLayout';
import WaitingRoom from './pages/WaitingRoom';


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true, 
          element: <Home />
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

export default App
