import { useEffect, useRef } from "react";
import { useWebSocket } from "../../layouts/GameLayout";
import { useOutletContext, useParams } from "react-router-dom";
import LeaderBoard from "./LeaderBoard";

import CountDownCircle from "./CountDownCircle";
import { useGameSocketContext } from "../../contexts/GameSocketProvider";

export default function InGamePresentatorPage() {
  const { id: gameId } = useParams();
  const {socket, isSocketReady} = useWebSocket();
  const socketInstance = socket.current;
  const { role } = useOutletContext();


  const { players, roundData } = useGameSocketContext(gameId);
  const audioRef = useRef(null);


  // ------------------------------------
  // -------- HANDLERS ------------------

  const handleAudioLoaded = () => {
    console.log("Audio loaded, presentator is ready");

    if(socketInstance) {
      socketInstance.emit('audio-ready', { gameId, roundNumber: roundData.currentRound });
    } else {
      console.error("socket instance is undefined")
    }


  };


  useEffect(() => {
    if (isSocketReady && socketInstance) {
      console.log("Emitting get-room-players from InGamePresentatorPage");
      socketInstance.emit("get-room-players", gameId);
    }
  }, [isSocketReady, gameId, socketInstance]);

  useEffect(() => {
    // load / fetch audio extract
    if(audioRef.current && roundData.audioUrl) {
      audioRef.current.src = roundData.audioUrl;
      audioRef.current.load();
      console.log("Source de l'élément Audio mise à jour : ", roundData.audioUrl);
    }
  }, [roundData.audioUrl]);



  useEffect(() => {
    // plays audio when value of roundInProgress changes
    if(roundData.roundInProgress && audioRef.current) {
      audioRef.current
        .play()
        .then(() => console.log("Audio is playing"))
        .catch((err) => 
          console.error("Error playing audio : ", err)

      );
    }
  }, [roundData.roundInProgress]);



  return (
    <div>
      <p>InGamePresentatorPage</p>
      <p>Socket: {socketInstance?.id}</p>
      <p>Role: {role}</p>

      <p className="text-center mb-20">
        <span className="bg-white text-black rounded-md p-4">
          Round {roundData.currentRound} / {roundData.roundsNumber ?? "..."}
        </span>
      </p>

      {/*  */}
      <div className="flex flex-col-reverse md:flex-row justify-around mx-auto max-w-7xl">
        {/* Left */}
        <div className="relative p-10 ">
          
          

          <LeaderBoard 
            players={players} 
            setPlayers = { () => {} } 
            socket={socketInstance} 
            currentRound={roundData.currentRound}
          />

        </div>

        {/* Right */}
        <div>
          {/** Audio Ref */}
          <audio 
            ref={audioRef} 
            
            preload="auto" 
            onCanPlayThrough={handleAudioLoaded} 
            onError={(e) => console.error("Erreur lors du chargement de l'audio : ", e)}
          >
            <source src={roundData.audioUrl || ""}></source>
          </audio>

          {/** Local counter */}
          <div className="flex flex-col items-center gap-3 ">
            <CountDownCircle
              currentRound={roundData.currentRound}
              roundInProgress={roundData.roundInProgress}
              timeLeft={roundData.timeLeft}
            />

            {roundData.correctAnswer && (
              <div className="flex flex-col gap-3 ">
                
                <p className="text-white">
                  Bonne réponse :
                </p>
                <span className="bg-white text-black rounded-md p-4">
                  {roundData.correctAnswer.artistName} - {roundData.correctAnswer.title}
                </span>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
