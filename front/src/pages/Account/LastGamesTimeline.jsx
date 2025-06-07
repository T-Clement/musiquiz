import Button from "../../components/Button";

export function LastGamesTimeline({ games }) {
  return (
    <section className="relative pl-6">
      {/* left vertical ligne*/}
      <span
        className="absolute left-0 top-0 h-full w-1
                       bg-slate-50 rounded"
      />
      <h3 className="text-xl font-semibold text-white mb-8">
        Vos dernières parties
      </h3>

      <ul className="space-y-10">
        {games.map((gameData, index) => (
          <li key={gameData.game.id} className="relative">
            <div
              className="rounded-lg bg-slate-800/70 backdrop-blur
                            ring-1 ring-white/10 shadow
                            px-5 py-4 flex flex-col gap-2
                            hover:shadow-purple-700 transition"
            >
              <p className="text-lg text-slate-50 font-semibold">
                {gameData.game.score.toLocaleString()} pts
              </p>
              <p className="text-slate-400 text-sm">
                {new Date(gameData.game.date_score).toLocaleString("fr-FR")}
              </p>
              <Button
                to={`/game/${gameData.game.id}`}
                variant="info"
                className="self-start mt-1"
              >
                Détails
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
