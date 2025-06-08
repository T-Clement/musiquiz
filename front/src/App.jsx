import "./App.css";
import { RouterProvider } from "react-router-dom";

import { AuthContextProvider } from "./hooks/authContext";
import { router } from "./router";


export function App() {
  console.log("Render App");
  return (
    <AuthContextProvider>
    
      <RouterProvider
        router={router}
        fallbackElement={<div className="">Loading ...</div>}
      >
      </RouterProvider>
    </AuthContextProvider>
  );
}
