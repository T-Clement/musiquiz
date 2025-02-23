import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../../layouts/GameLayout";
import { useOutletContext, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import LeaderBoard from "./LeaderBoard";

import CountDownCircle from "./CountDownCircle";

export default function InGamePresentatorPage() {
  const { id: gameId } = useParams();
  const {socket} = useWebSocket();
  const socketInstance = socket.current;
  const { role, setRole } = useOutletContext();

  // -------------------------------------------
  // STATES
  // -------------------------------------------
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundsNumber, setRoundsNumber] = useState(null);

  // url of extract of currentRound
  const [audioUrl, setAudioUrl] = useState(null);
  // to handle reading of audio
  const audioRef = useRef(null);

  // to show if the round is in "loading state"
  const [isLoading, setIsLoading] = useState(false);

  //
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [isRoundOver, setIsRoundOver] = useState(false);
  // local counter but server is the single source of truth !!!
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!socketInstance) return;

    // when component mounted, ask for players in game / room
    socketInstance.emit("get-room-players", gameId);

    // handle reception of players in room
    socketInstance.on("room-players-list", (players) => {
      setPlayers(players);
    });

    // server send data of round
    socketInstance.on("round-loading", (data) => {
      console.log("Round is loading");
      setIsRoundOver(false);
      setRoundInProgress(false);
      setIsLoading(false);

      const { roundNumber, totalRounds, extractUrl } = data;
      setCurrentRound(roundNumber);
      setRoundsNumber(totalRounds);
      setAudioUrl(extractUrl);

      // prepare audio locally
      if (audioRef.current) {
        audioRef.current.src = extractUrl;
        audioRef.current.load();
      }
    });

    // server has launched the round, round is officialy started
    socketInstance.on("round-started", (data) => {
      // data: roundDuration ?, ..
      console.log("Round just started");
      // console.log(data.roundDuration);
      setRoundInProgress(true);
      setIsRoundOver(false);
      setCorrectAnswer(null);

      // start local counter
      if (data.roundDuration) {
        // console.log("if round duration");
        setTimeLeft(data.roundDuration);
      } else {
        setTimeLeft(30);
      }

      // play audio
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.error(`Error playing audio : ${err}`);
        });
      }
    });

    //
    socketInstance.on("round-results", (resultsData) => {
      // resultsData: correctAnswer, scores, nextRoundNumber, ...
      console.log("roundInProgress changed to:", roundInProgress);
      setCorrectAnswer(resultsData.correctAnswer);
      // setRoundInProgress(false);
      setIsRoundOver(true);

      // update the leaderboard with new scores of players coming from server
      if (resultsData.updatedPlayers) {
        setPlayers(resultsData.updatedPlayers);
      }

    });

    socketInstance.on("game-ended", (message) => {
      console.warn(message);
    });

    return () => {
      socketInstance.off("room-players-list");
      socketInstance.off("round-started");
      socketInstance.off("round-results");
      socketInstance.off("round-loading");
    };
  }, [socket, gameId]);

  // ------------------------------------
  // -------- HANDLERS ------------------

  const handleAudioLoaded = () => {
    console.log("Audio loaded, presentator is ready");

    // do nothing in server side ...
    // socketInstance.emit("presentator-ready", {
    //   gameId,
    //   roundNumber: currentRound
    // });
  };

  // console.log(players);
  // console.log(rounds);

  return (
    <div>
      <p>InGamePresentatorPage</p>
      <p>Socket: {socket?.id}</p>
      <p>Role: {role}</p>

      <p className="text-center mb-20">
        <span className="bg-white text-black rounded-md p-4">
          Round {currentRound} / {roundsNumber ?? "..."}
        </span>
      </p>

      {/*  */}
      <div className="flex justify-around">
        {/* Left */}
        <div className="relative p-10 ">
          
          

          <LeaderBoard players={players} setPlayers = { setPlayers }/>

        </div>

        {/* Right */}
        <div>
          {/** Audio Ref */}
          <audio ref={audioRef} onCanPlay={handleAudioLoaded} />

          {/** Local counter */}
          <div className="flex flex-col gap-3">
            <CountDownCircle
              currentRound={currentRound}
              roundInProgress={roundInProgress}
              timeLeft={timeLeft}
            />

            {correctAnswer && (
              <div className="flex flex-col gap-3">
                
                <p className="text-white ">
                  Bonne réponse :
                </p>
                <span className="bg-white text-black rounded-md p-4">
                  {correctAnswer.artistName} - {correctAnswer.title}
                </span>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
