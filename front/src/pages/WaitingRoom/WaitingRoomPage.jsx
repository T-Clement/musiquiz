import axios from "axios";
import { useEffect, useState } from "react";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useWebSocket } from "../../layouts/GameLayout";
import { WaitingRoom } from "./WaitingRoom";

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
  const { userId } = state;
  const { role } = useOutletContext();
  const { socket } = useWebSocket();
  const socketInstance = socket.current;
  // data coming from component loader
  const { game } = useLoaderData();
  // id of game in url params
  const { id: gameId } = useParams();
  const navigate = useNavigate();
  // console.log(game)

  // ----------------------------------------
  // STATES
  // initialization with players connected in
  const [players, setPlayers] = useState(game.players || []);
  // state to display if there is a presentator in game
  const [presentator, setPresentator] = useState(game.presentator || null);


  // check for {userId: value, websocketId, value} when page connection (connection lost, reload of page, ...)

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

  // -------------------------------------------------------------
  // HANDLERS 
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
      socketInstance.emit("presentator-left", gameId, userId ?? null);

      // optional because where are leaving ???
      setPresentator(null);

      navigate("/");
    }
  };

  const handleLaunchGame = () => {
    // ws event to launch game
    console.log(role +  " lance la partie");
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

  return (
  <WaitingRoom 
    game={game} 
    onKick={() => { console.log("Not implemented yet !") }} // check if socket who sends event is really presentator socket
    onLaunch={handleLaunchGame} // no arguments 
    onQuit={() => handleQuitRoom(userId, role)} // arguments to function so need () => { ... }
    players={ players }
    presentator={ presentator}
    role={ role }
  />
  )
}
