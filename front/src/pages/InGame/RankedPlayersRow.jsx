import React from "react";

export default function RankedPlayerRow({ player }) {
  return (
    <div className="flex items-center bg-[#E69C81] rounded-full p-2 mb-2 shadow-md">
      <span className="text-white font-bold text-lg ml-3 w-6">{player.id}</span>
      <img
        src={""}
        alt={player.pseudo}
        className="w-10 h-10 rounded-full border-2 border-white mx-2"
      />
      <span className="text-white font-medium flex-grow">{player.pseudo}</span>
      <span className="text-white text-sm mr-3">{player.score} points</span>
    </div>
  );
}
