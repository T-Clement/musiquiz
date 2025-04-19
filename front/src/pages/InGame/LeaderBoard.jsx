import React, { useEffect, useRef, useState } from "react";
import FlipMove from "react-flip-move";
import LeaderBoardRow from "./LeaderBoardRow";
import { useAnsweredPlayers } from "../../hooks/useAnsweredPlayers";

export default function LeaderBoard({
  players,
  setPlayers,
  socket,
  currentRound,
}) {

    // Set who stores states about player if answering animation is running and
    // if the player as responded
    // reset at the end of the round
  const { answeredSet } = useAnsweredPlayers(
    socket,
    currentRound
  );

  return (
    <table className="w-full text-sm text-left">
      <thead className="text-xs uppercase border-b-2 bg-slate-600">
        <tr>
          <th scope="col" className="px-6 py-3">
            Classement
          </th>
          <th scope="col" className="px-6 py-3">
            Pseudo
          </th>
          <th scope="col" className="px-6 py-3">
            Score
          </th>
        </tr>
      </thead>

        {/* reordering animation */}
      <FlipMove className="" typeName="tbody">
        {players.map((player, index) => (
          <LeaderBoardRow
            key={player.userId}
            rank={index + 1}
            pseudo={player.pseudo}
            score={player.score}
            hasAnswered={answeredSet.has(player.userId)}
            currentRound={currentRound}
          />
        ))}
      </FlipMove>
    </table>
  );
}
