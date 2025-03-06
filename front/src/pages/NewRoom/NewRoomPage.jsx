import React, { useState } from "react";
import apiAxios from "../../libs/axios";

import Spinner from "../../components/Spinner";

// put in the loader a check is User is authenticated
// put in the loader a check is User is authenticated
// put in the loader a check is User is authenticated
// put in the loader a check is User is authenticated



export default function NewRoomPage() {

  // page only if user is authenticated
  // page only if user is authenticated
  // page only if user is authenticated
  // page only if user is authenticated


  const [playlistId, setPlaylistId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playlistTestResult, setPlaylistTestResult] = useState(null);

  // for room creation form
  const [roomTitle, setRoomTitle] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomTheme, setRoomTheme] = useState("");
  const [availableThemes, setAvailableThemes] = useState([]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlaylistTestResult(null);

    try {
      const response = await apiAxios.post(`api/room/check-new-playlist`, {
        playlist_id: playlistId,
      });
      setPlaylistTestResult(response.data);

      if(response.data.data.themes) {
        setAvailableThemes(response.data.data.themes);
      }
    } catch (error) {
      setError(
        "Une erreur s'est produite lors de la vérification de la playlist"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiAxios.post(`api/room/store`, {
        playlist_id: playlistId,
        title: roomTitle,
        description: roomDescription,
        theme_id: roomTheme,
      });

      alert("Room créée avec succès !");
      setRoomTitle("");
      setRoomDescription("");
      setRoomTheme("");
      setPlaylistId("");
      setPlaylistTestResult(null);
      setAvailableThemes([]);

      // navigate to new created room


    } catch (error) {
      setError("Erreur lors de la création de la Room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-4">
      <div className="">
        <h2 className="text-2xl mb-4">Ajouter une nouvelle room</h2>
        <p className="my-3">
          Vous ne trouvez pas la room qui vous plaît ? Pas de soucis, il est
          possible d'en rajouter une nouvelle.
        </p>

        <div>
          <p className="my-3">
            Pour cela, munissez vous d'un identifiant de playlist Deezer avec
            une playlist qui remplit les conditions suivantes :
          </p>

          <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Au moins 40 chansons
            </li>
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Avec des extraits de 30 secondes disponibles
            </li>
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-gray-500 dark:text-gray-400 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Dont la lecture est possible dans votre pays
            </li>
          </ul>
        </div>
      </div>

      {/* <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Password requirements:</h2> */}

      <form method="POST" action="" onSubmit={handleSubmit}>
        <div className="flex flex-col max-w-80 mx-auto gap-3 m-3">
          <input
            className="py-3 px-3 placeholder:italic text-black"
            name="playlist_id"
            type="search"
            placeholder="Identifiant de playlist : 1234567"
            required
            onChange={(e) => setPlaylistId(e.target.value)}
          />
          <button
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            type="submit"
          >
            Tester
          </button>
        </div>
      </form>

      <div className="mt-5">
        <p>
          Vous trouverez ici les détails de l'analyse de votre playlist si elle
          est acceptée ou non par l'application.
        </p>

        {
          // rendu conditionnel du bouton qui permet d'enregistrer la nouvelle playlist
          // ainsi que du formulaire permettant de placer les données de
          // la room
          //
        }

        {loading && (
          <div className="flex gap-3 my-4">
            <p>Vérification en cours</p>
            <Spinner />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {playlistTestResult && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-center mt-4 p-4 ">
              {playlistTestResult.state
                ? "Playlist acceptée"
                : "Playlist refusée"}
            </h3>

            <p>{playlistTestResult.message}</p>

            <h4 className="mt-2 text-lg">Détails :</h4>

            <ul className="list-disc pl-5">
              <li>
                Nombre de titres valides :{" "}
                {playlistTestResult.data.tracksAvailables.length}
              </li>
              <li>
                Titres non lisibles :{" "}
                {playlistTestResult.data.notReadablesTracks.length}
              </li>
              <li>
                Titres sans extrait :{" "}
                {playlistTestResult.data.noExtractsTracks.length}
              </li>
            </ul>

            {playlistTestResult?.state && (
              <form
                method="POST"
                onSubmit={handleRoomSubmit}
                className="mt-6 p-4 shadow-md rounded-md"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Créer une Room avec cette Playlist
                </h3>

                <div className="flex flex-col gap-3">
                  <input
                    className="py-2 px-3 border rounded text-gray-400"
                    type="text"
                    placeholder="Titre de la Room"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    required
                  />

                  <input className="py-2 px-3 border rounded" type="text" disabled value={playlistId}/>


                  <textarea
                    className="py-2 px-3 border rounded text-gray-400"
                    placeholder="Description de la Room"
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    required
                  ></textarea>

                  <select
                      className="py-2 px-3 border rounded text-gray-400"
                      value={roomTheme}
                      onChange={(e) => setRoomTheme(e.target.value)}
                      required
                    >
                    <option className="text-gray-400" value="" disabled selected>Choisir un thème</option>

                    {availableThemes.map((theme, index) => (
                      <option className="text-gray-400" key={theme.id} value={parseInt(theme.id)}>{theme.name}</option>
                    ))}

                  </select>

                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    type="submit"
                  >
                    🎵 Ajouter la Room
                  </button>
                </div>
              </form>
            )}

            
          </div>
        )}
      </div>
    </section>
  );
}
