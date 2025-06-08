import axios from "axios";
import { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Button from "../../components/Button";
import { useContext } from "react";
import { AuthContext } from "../../hooks/authContext";
import Separator from "../../components/Separator";
import Heading2 from "../../components/Heading2";
import SubHeading2 from "../../components/SubHeading2";
import SimpleRoomTile from "./SimpleRoomTile";
import NavLinkWithViewTransition from "../../components/NavLinkWithViewTransition";

export async function loader({ params }) {
  const roomData = await fetch(
    `${import.meta.env.VITE_API_URL}/api/room/${params.id}`
  ).then((response) => response.json());
  return { roomData };
}


// TODO : add a row under the table to show the score of the player if he has played in this
// TODO : this room and is not in the display of the best scores
export function RoomPage() {
  const navigate = useNavigate();
    const handleOpen = (id) => navigate(`/room/${id}`);

  console.log("Render Home Page");

  let { id } = useParams();

  console.log(`In room page id ${id}`);

  const { roomData } = useLoaderData();
  const [loading, setLoading] = useState(false);

  console.log(roomData);

  // if user is connected, get id of user to compare if user is in list of table
  const user = useContext(AuthContext);
  const userId = user.user ? user.user.userId : null;

  // count of parties played

  // add datas related to previous games in this room (history of parties ??)


  const handleCreateGame = async (roomId) => {
    setLoading(true);
    console.warn(roomId);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/game/create-game`,
        {
          roomId: roomId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { gameId, sharingCode } = response.data;

      // send gameId (_id) to next page
      setLoading(false);
      navigate(
        `/game/${gameId}/choose-role?source=create&sharingCode=${sharingCode}`,
        { state: { gameId } }
      );
    } catch (error) {
      console.error("Error creating game : ", error);
    }
  };

  // used to style first rows of table of bestscores of room
  const podiumClasses = [
    "bg-amber-400/20 hover:bg-amber-400/30", // 1er
    "bg-gray-300/20  hover:bg-gray-300/30", // 2e
    "bg-yellow-700/20 hover:bg-yellow-700/30", // 3e
  ];

  return (
    <div className="mx-2 mb-8">
      <section className="mb-2 max-w-lg">
        <p className="mb-6">RoomPage - id : {id}</p>
        <Heading2>{roomData.room.name}</Heading2>
        <Separator />
        <SubHeading2>{roomData.room.description}</SubHeading2>
      </section>


      <div className="flex flex-wrap justify-center gap-y-6 p-8">
        <div className="w-full md:w-1/2 flex justify-center max-w-md">
          <div
            className="relative fade-in rounded-lg bg-slate-900/85 backdrop-blur
                ring-2 ring-violet-500/60 shadow-[0_0_20px_4px_rgba(124,58,237,0.25)]
                overflow-hidden w-full"
          >
            <div className="absolute inset-0 -z-10 bg-[url('/assets/grid.svg')] opacity-5" />


            <table className="min-w-full text-sm text-slate-200">
              <thead>
                <tr className="bg-violet-700/80 text-xs tracking-wider uppercase">
                  <th className="px-4 py-3 text-center w-10">#</th>
                  <th className="px-4 py-3">Pseudo</th>
                  <th className="px-4 py-3 text-right">Points</th>
                </tr>
              </thead>

              <tbody>
                {roomData.room.scores.length > 0 ? (
                  roomData.room.scores.map((bestscore, index) => ( // index use as ranking

                    <tr
                      key={bestscore.id}
                      className={`
                      ${
                        index < 3
                          ? podiumClasses[index]
                          : "even:bg-white/5 hover:bg-violet-600/25 transition-colors"
                      }
                      ${bestscore.id_user == userId ? "font-black" : ""}
                      `}
                    >
                      <td className="px-4 py-3 text-center relative"><span
                          className={
                            bestscore.id_user == userId
                              ? "absolute left-2 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-emerald-400 rounded" // tick to show user connected
                              : ""
                          }
                        />
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        {bestscore.pseudo_user}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {bestscore.score.toLocaleString()} pts
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="">
                    <td
                      colSpan={3}
                      className="px-4 py-10 text-center text-slate-300"
                    >
                      Aucune partie jouée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <h3 className="">Multijoueur</h3>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              className="flex flex-row-reverse items-center gap-4"
              variant="secondaryDark"
              onClick={() => handleCreateGame(id)}
            >
              <span>{loading && <Spinner />}</span>
              <span>Créer une partie</span>
            </Button>

            <Button
              className="cursor-not-allowed"
              variant="secondaryDark"
              disabled={true}
            >
              Créer une partie <br /> personnalisée
            </Button>
          </div>
        </div>
      </div>



      {/* related rooms with the same theme */}
      <section className="w-full mb-14">
        <Heading2 additionnalClasses="!text-2xl">
            Rooms du meme thème <NavLinkWithViewTransition to={`/theme/${roomData.room.id_theme}`} className="bg-slate-50 text-slate-700 p-2 rounded text-transparent">{roomData.room.theme.name}</NavLinkWithViewTransition>
          </Heading2>

          <Separator />

        {/* carrousel on mobile — grid on desktop */}
        <div className="
          flex gap-6 overflow-x-auto md:overflow-visible
          scroll-snap-x
          md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        ">
          {roomData.room.theme.relatedRooms.map((r) => (
            <div key={r._id} className="scroll-snap-start md:scroll-snap-none mb-4">
              <SimpleRoomTile room={r} onClick={handleOpen} />
            </div>
          ))}
        </div>
      </section>

    </div>



  );
}
