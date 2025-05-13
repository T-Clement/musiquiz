import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { AuthContext } from "../hooks/authContext";

export function DefaultLayout() {
  console.log("render Default Layout");

  const { user, setUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Chargement ...</div>;
  }

  console.log("User in DefaultLayout : ", user);

  return (
    <div>
      <div className="sticky top-0 z-20 bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-md">
        <Header user={user} setUser={setUser} />
      </div>
      <div className="max-w-screen-xl	mx-auto">
        <p>DefaultLayout</p>
        <Outlet />
      </div>
    </div>
  );
}
