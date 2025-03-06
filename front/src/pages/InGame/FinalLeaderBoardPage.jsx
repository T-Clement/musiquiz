import React from "react";
import TopPlayers from "./TopPlayers";
import RankedPlayers from "./RankedPlayers";
import { useLocation, useNavigate } from "react-router-dom";



export default function LeaderboardPage() {

  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);
  const {scores, roomName, tracks} = location.state;

  // console.log(scores);


  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h3 className="mb-8">{roomName}</h3>
      <h3 className="mb-8">🏆 Classement 🏆</h3>
      <TopPlayers players={scores.slice(0, 3)} />
      <RankedPlayers players={scores.slice(3)} />
    </div>
  );
}
