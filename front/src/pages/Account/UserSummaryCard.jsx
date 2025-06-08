import Heading2 from "../../components/Heading2";
import LinkWithViewTransition from "../../components/LinkWithViewTransition";

export function UserSummaryCard({ user, games }) {
  return (
    <section
      className="rounded-2xl bg-white/5 backdrop-blur-md
                        px-8 py-6 mt-8 flex flex-col sm:flex-row items-start gap-6"
    >
      <div className="flex-1">
        <Heading2 additionnalClasses="!text-2xl text-white">
          Compte de{" "}
          <span className="bg-slate-50 rounded-xl p-2 text-gray-700">
            {user.pseudo}
          </span>
        </Heading2>
        <p className="text-slate-300 mt-1">
          Créé le&nbsp;:&nbsp;
          {user.createdAt !== null ? (
            new Date(user.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          ) : (
            <span className="italic">information non disponible</span>
          )}
        </p>

        {/* stats part */}
        <div className="mt-4 flex flex-col gap-1 text-slate-200">
          {/* Number of games played */}
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-2 justify-center">
              <span className="" fill="currentColor">
                🕹️
              </span>
              {games.length} parties jouées
            </span>
          </div>

          {/* Theme and room most played */}
          <div>
            <p className="">
              Thème le plus joué :
              <span className="bg-slate-50 rounded-md p-1 text-gray-700 font-bold ms-2">
                <LinkWithViewTransition>test</LinkWithViewTransition>
              </span>
            </p>
          </div>

          <div>
            <p className="">
              Room la plus jouée :
              <span className="bg-slate-50 rounded-md p-1 text-gray-700 font-bold ms-2">
                <LinkWithViewTransition>test</LinkWithViewTransition>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
