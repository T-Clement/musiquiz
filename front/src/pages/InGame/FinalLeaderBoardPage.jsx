import React from "react";
import TopPlayers from "./TopPlayers";
import RankedPlayers from "./RankedPlayers";
import { useLocation, useNavigate } from "react-router-dom";



export default function LeaderboardPage() {

  const location = useLocation();
  const navigate = useNavigate();
  const scores = location.state;

  // console.log(scores);


  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="mb-8">🏆 Classement 🏆</h1>
      <TopPlayers players={scores.slice(0, 3)} />
      <RankedPlayers players={scores.slice(3)} />
    </div>
  );
}
