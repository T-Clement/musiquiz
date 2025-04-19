import React from "react";

export default function PlayerCard({ player, index, totalPlayers }) {

    // size of tile related to number of players in the game
    // and also the final ranking of the player
    let sizeClass;
    if (totalPlayers === 1) {
      sizeClass = "w-40 h-52 md:w-48 md:h-60";
    } else if (totalPlayers === 2) {

      // 2 players : first bigger and second smaller
      sizeClass =
        index === 0
          ? "w-36 h-44 md:w-44 md:h-52"
          : "w-32 h-32 md:w-36 md:h-40";
    } else {

      // 3+ players : podium first, 2nd, 3rd with differents sizes
      sizeClass =
        index === 0
          ? "w-32 h-40 md:w-40 md:h-52"  // first
          : index === 1
          ? "w-32 h-32 md:w-36 md:h-40"  // 2nd
          : "w-32 h-28 md:w-32 md:h-33"; // 3rd
    }
  
    // order for podium
    let orderClass;
    if (totalPlayers === 1) {
      // one player, in the center
      orderClass = "order-1";
    } else if (totalPlayers === 2) {
      // 2 players: order first and second
      orderClass = `order-${index + 1}`;
    } else {
      // 3+ joue
      // order 3 - 1 - 2
      switch (index) {
        case 2:
          orderClass = "order-1"; // third player at the left
          break;
        case 0:
          orderClass = "order-2"; // first player in the middle
          break;
        case 1:
          orderClass = "order-3"; // second player on the right
          break;

      }
    }

  return (
    <div className={`relative flex flex-col items-center bg-white rounded-lg shadow-md p-4 ${sizeClass} ${orderClass}
      }`}>
      <img
        src={""}
        alt={player.pseudo}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white -mt-10"
      />
      <span className="text-xl font-bold text-gray-800">{index + 1}</span>
      <p className="text-center text-sm font-semibold text-gray-700">{player.pseudo}</p>
      <p className="text-xs text-gray-500">{player.score} points</p>
    </div>
  );
}
