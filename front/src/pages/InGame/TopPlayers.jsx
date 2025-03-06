import React from "react";
import PlayerCard from "./PlayerCard";

export default function TopPlayers({ players }) {
  return (
    <div className={`flex ${players.length === 2 ? "justify-around" : "justify-center"} w-full max-w-lg items-end mb-6 gap-4`}>
      {players.map((player, index) => (
        <PlayerCard key={player.id} player={player} index={index} totalPlayers={players.length} />
      ))}
    </div>
  );
}