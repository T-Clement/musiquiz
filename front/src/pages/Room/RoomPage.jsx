import axios from "axios";
import React, { useState } from "react";
import {
  Navigate,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import Spinner from "../../components/Spinner";
// import apiAxios from '../../libs/axios';

export async function loader({ request, params }) {
  // console.log(request, params);
  // let {id} = useParams();
  // console.log(id);
  const roomData = await fetch(
    `${import.meta.env.VITE_API_URL}/api/room/${params.id}`
  ).then((response) => response.json());
  // console.log(roomData);
  return { roomData };
}

export function RoomPage() {
  const navigate = useNavigate();

  console.log("Render Home Page");

  let { id } = useParams();

  console.log(`In room page id ${id}`);

  const { roomData } = useLoaderData();
  const [loading, setLoading] = useState(false);

  console.log(roomData);

  // if user is connected, get id of user to compare if user is in list of table
  // const user = useContext(AuthContext);

  // count of parties played

  // room classement

  // Buttons create multi room custom or default

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

      const { gameId } = response.data;

      // navigate(`/game/${gameId}/waiting-room`);

      // send gameId (_id) to next page
      setLoading(false);
      navigate(`/game/${gameId}/choose-role`, { state: { gameId } });
    } catch (error) {
      console.error("Error creating game : ", error);
    }

    // appel api qui récupère les données de la room et genère un document avec les données
    // nécessaires (identifiant api playlist, joueurs, date de création, identi)

    // {
    //     "gameId": "unique_game_id",
    //     "host": {
    //       "userId": "host_user_id",
    //       "pseudo": "host_pseudo"
    //     },
    //     "players": [
    //       {
    //         "userId": "player_1_id",
    //         "pseudo": "player_1_pseudo"
    //       },
    //       {
    //         "userId": "player_2_id",
    //         "pseudo": "player_2_pseudo"
    //       }
    //     ],
    //     "status": "waiting", // 'waiting', 'in_progress', 'completed'
    //     "createdAt": "2024-09-12T12:34:56Z",
    //     "settings": {
    //       "maxPlayers": 10,
    //       "gameMode": "classic",
    //       "playlist": "playlist_id"
    //     }
    //   }
  };

  return (
    <div>
      <p className="mb-6">RoomPage - id : {id}</p>
      <p className="mb-6">{roomData.room.name}</p>
      <p className="mb-6">{roomData.room.description}</p>
      <div className="flex flex-wrap gap-y-6 p-2">
        <div className="w-full md:w-1/2">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Pseudo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomData.room.scores && roomData.room.scores.length > 0 ? (
                  roomData.room.scores.map((score, index) => (
                    <tr key={score.id} className="bg-white border-b">
                      <td className="px-6 py-4 text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-900">
                        {score.pseudo_user}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {score.score} pts
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center px-6 py-4">
                      Aucun score enregistré pour cette salle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <h3>Multijoueur</h3>
          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex flex-row-reverse items-center gap-4"
              onClick={() => handleCreateGame(id)}
            >
              <span>{loading && <Spinner />}</span>
              <span>Créer une partie</span>
            </button>
            <button
              type="button"
              className="cursor-not-allowed text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              disabled
            >
              Créer une partie <br /> personnalisée
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
