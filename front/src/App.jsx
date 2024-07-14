import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import DefaultLayout from './layouts/DefaultLayout';


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      errorElement: <ErrorPage />,
      children: [
        {index: true, element: <Home />}
      ]
    }
  ])

  return <RouterProvider router = {router} />
}

export default App
