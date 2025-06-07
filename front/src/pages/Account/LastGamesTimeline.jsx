import Button from "../../components/Button";
import Heading2 from "../../components/Heading2";

export function LastGamesTimeline({ games }) {
  return (
    <section className="relative pl-6">
      {/* left vertical ligne*/}
      <span
        className="absolute left-0 top-0 h-full w-1
                       bg-slate-50 rounded"
      />
      <Heading2 additionnalClasses="text-xl font-semibold text-white mb-4">
        Vos dernières parties
      </Heading2>

      <ul className="space-y-6">
        {games.map((gameData, index) => (
          <li
            key={gameData.game.id}
            className="relative flex flex-col md:flex-row md:justify-between gap-2 rounded-lg bg-slate-800/70 backdrop-blur
                            ring-1 ring-white/10 shadow  hover:shadow-purple-700 transition
                            px-5 py-4 "
          >
            <div
              className="flex flex-col gap-2"
            >
              <p className="text-lg font-black">{gameData.metaData.name}</p>
              <p className="text-lg text-slate-50 font-semibold">
                {gameData.game.score.toLocaleString()} pts
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <p className="text-slate-400 text-sm ">
                {new Date(gameData.game.date_score).toLocaleString("fr-FR")}
              </p>
              <Button
                to={`/game/${gameData.game.id}`}
                variant="info"
                className=""
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
