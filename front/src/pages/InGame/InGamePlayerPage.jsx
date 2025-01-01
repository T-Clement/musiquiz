import React, { useContext, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useWebSocket } from "../../layouts/GameLayout";
import Spinner from "../../components/Spinner";
import { AuthContext } from "../../hooks/authContext";

export default function InGamePlayerPage() {
  const { id: gameId } = useParams();

  const user = useContext(AuthContext);
  const userId = user.user.user.userId;

  const socket = useWebSocket();

  const { role, setRole } = useOutletContext();

  // LOCAL STATES
  const [currentRound, setCurrentRound] = useState(null);
  const [roundChoices, setRoundChoices] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [choiceIsSubmited, setChoiceIsSubmited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [revealChoices, setRevealChoices] = useState(false);


  useEffect(() => {

    socket.on("round-loading", (data) => {
      setCurrentRound(data.roundNumber);
      setIsLoading(true);
    });

    socket.on("round-started", (data) => {
      setIsLoading(false);
      setRoundChoices(data.choices);
    });

    socket.on("round-results", () => {
      setRoundChoices(null); // TODO: see if another way is possible to avoid rerendering of component ..
      setIsLoading(true);
    });


    return () => {
      socket.off("round-loading");
      socket.off("round-started");
      socket.off("round-results");
    };
  }, [socket, currentRound]);


  // send choice of player to server
  const submitAnswer = (choiceId) => {
    socket.emit("submit-answer", {
      gameId,
      userId: userId,
      roundNumber: currentRound,
      choiceId,
    });
    setChoiceIsSubmited(true);
    setRoundChoices(null);
    setIsLoading(true);
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-20">
        <p className="my-4">InGamePlayerPage</p>

        <p className=" p-4 bg-white text-violet-900 rounded-lg text-lg font-bold">
          Round {currentRound}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {isLoading ? (
          <Spinner />
        ) : (
          roundChoices?.map((choice) => (
            <button
              className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}
              key={choice.choicId}
              onClick={() => submitAnswer(choice.choiceId)}
            >
              <span className="">
                {choice.artistName} - {choice.title}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
