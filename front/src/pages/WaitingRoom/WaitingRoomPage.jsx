import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useWebSocket } from "../../layouts/GameLayout";
import WaitingRoomPresentator from "./WaitingRoomPresentator";
import WaitingRoomPlayer from "./WaitingRoomPlayer";

export async function loader({ params }) {
  const { id } = params;
  console.log("id:", id);
  // get data from game in MongoDB database
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/game/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response || response.data.game.status !== "waiting") {
    throw new Response("Game not found or not in waiting status", {
      status: 404,
    });
  }

  return response.data;
}

export default function WaitingRoomPage() {
  // issue when page reload becaus state data is not available because there is no previous navigation
  const { state } = useLocation();
  const { userId, pseudo } = state;

  const { role, setRole } = useOutletContext();

  const { socket } = useWebSocket();
  const socketInstance = socket.current;

  // data coming from component loader
  const { game } = useLoaderData();

  // initialization with players connected in
  const [players, setPlayers] = useState(game.players || []);

  // state to display if there is a presentator in game
  const [presentator, setPresentator] = useState(game.presentator || null);

  // id of game in url params
  const { id: gameId } = useParams();

  // console.log("gameId :", gameId)

  const navigate = useNavigate();

  // console.log("User role : ", role);
  //

  // CHANGE LAYOUT !!!!
  // IF ARRIVED HERE, PLAYER IS A USER
  // OR NOT CONNECTED DEVICE CAN ONLY BE A PRESENTATOR

  // check for {userId: value, websocketId, value} when page connection (connection lost, reload of page, ...)

  // console.error(state);

  // console.log(game);

  useEffect(() => {
    if (!socketInstance) return;

    // player join room
    socketInstance.on("player-joined", (newPlayer) => {
      console.log("A new player joined the room");
      setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    });

    // player quit room
    socketInstance.on("player-left", (userId) => {
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.userId != userId)
      );
    });

    // presentator join room
    socketInstance.on("presentator-joined", (newPresentator) => {
      setPresentator(newPresentator);
    });

    // presentator left room
    socketInstance.on("presentator-left", (data) => {
      console.log("presentator left game", data);
      setPresentator(null);
    });

    socketInstance.on("update-players", (data) => {
      console.log(data); // userId, action properties in object
      if (data.action === "left") {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.userId !== data.userId)
        );
      }
    });

    // redirect to game component
    socketInstance.on("move-in-game", () => {
      console.warn("WS : Move in game socket Event");

      navigate(`/game/${gameId}/play/${role}`);
    });



    return () => {
      if (socketInstance) {
        socketInstance.off("player-left");
        socketInstance.off("player-joined");
        socketInstance.off("presentator-joined");
        socketInstance.off("presentator-left");
        socketInstance.off("update-players");
      }
    };
  }, [socketInstance, gameId, userId]);

  const handleQuitRoom = (userId, role) => {
    console.log("L'utilisateur souhaite quitter la partie");

    if (role === "player") {
      socketInstance.emit("player-left", gameId, userId);

      // optional because where are leaving ???
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.userId !== userId)
      );

      navigate("/");
    }

    if (role === "presentator") {
      socketInstance.emit("presentator-left", gameId);

      // optional because where are leaving ???
      setPresentator(null);

      navigate("/");
    }
  };

  const handleLaunchGame = () => {
    // ws event to launch game

    socketInstance.emit("launch-game", gameId, () => {
      console.log("WS : La partie est lancée par le présentateur");

      navigate(`/game/${gameId}/play/presentator`);
    });

    // post api call to update in noSQL database game state

    // if success, emit to all players in room to navigate in 'game/:id/:role' view / component

    // at witch time data for game is fetch ?
  };

  if (!socketInstance || !players) {
    return <div>Loading in WaitingRoom...</div>;
  }

  // console.log(players);

  return (
    <div className="mt-5">
      {/* <Link to={'/'} className='link'>Go back to Home</Link> */}

      <h1 className="text-2xl font-extrabold uppercase text-center mb-6">
        Salle d'attente
      </h1>

      <h2 className="flex flex-col items-center gap-4 mb-6">
        <span>Code pour rejoindre la partie :</span>
        <strong className="p-4 bg-white rounded-lg text-black inline-block mx-auto">
          {game.sharingCode}
        </strong>
      </h2>

      <h3 className="font-bold">Role utilisateur: {role}</h3>
      <p>Socket: {socketInstance.id}</p>

      {role === "presentator" ? (
        <WaitingRoomPresentator
          players={players}
          presentator={presentator}
          socket={socketInstance}
          handleLaunchGame={handleLaunchGame}
        />
      ) : (
        <WaitingRoomPlayer socket={socketInstance} presentator={presentator} />
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => handleQuitRoom(userId, role)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Quitter
        </button>
      </div>
    </div>
  );
}
