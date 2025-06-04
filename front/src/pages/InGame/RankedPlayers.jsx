import RankedPlayerRow from "./RankedPlayersRow";

export default function RankedPlayers({ players }) {
  return (
    <div className="w-full max-w-md sm:w-full">
      {players.length > 0 ? (
        players.map((player) => <RankedPlayerRow key={player.id} player={player} />)
      ) : (
        <p className="text-gray-300">Aucun autre joueur.</p>
      )}
    </div>
  );
}
