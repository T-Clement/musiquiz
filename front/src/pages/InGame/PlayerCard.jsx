import React from "react";

export default function PlayerCard({ player, index, totalPlayers }) {
  let sizeClass;
  if (totalPlayers === 1) {
    sizeClass = "w-40 h-52 md:w-48 md:h-60";
  } else if (totalPlayers === 2) {
    sizeClass = "w-36 h-44 md:w-44 md:h-52";
  } else {
    sizeClass = index === 0 ? "w-32 h-40 md:w-40 md:h-52" :
                index === 1 ? "w-32 h-32 md:w-36 md:h-40" :
                "w-32 h-28 md:w-32 md:h-33";
  }

  return (
    <div className={`relative flex flex-col items-center bg-white rounded-lg shadow-md p-4 ${sizeClass}`}>
      <img
        src={""}
        alt={player.pseudo}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white -mt-10"
      />
      <span className="text-xl font-bold text-gray-800">{player.id}</span>
      <p className="text-center text-sm font-semibold text-gray-700">{player.pseudo}</p>
      <p className="text-xs text-gray-500">{player.score} points</p>
    </div>
  );
}
