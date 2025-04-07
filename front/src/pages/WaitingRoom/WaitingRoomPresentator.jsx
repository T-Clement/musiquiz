import React, { useState } from "react";
import Modal from "../../components/Modal";
// import { useAudioContext } from "../../contexts/AudioContextProvider";

export default function WaitingRoomPresentator({
  players,
  presentator,
  socket,
  handleLaunchGame,
}) {
  const [showModal, setShowModal] = useState(false);
  // const { audioContext, initializeAudioContext } = useAudioContext();


  // const handleAudioAcceptance = async () => {
  //   const updatedAudioContext = await initializeAudioContext();
  //   if (updatedAudioContext && updatedAudioContext.state === "suspended") {
  //     await updatedAudioContext.resume();
  //   }
  //   setShowModal(false);

  //   // handleLaunchGame();
  // };

  const handleClick = async () => {
    // check if audio can be play in presentor browser's
    // try {
    // //   const updatedAudioContext = await initializeAudioContext();
    // // console.log(audioContext);
    //   const updatedAudioContext = audioContext;
    //   if (!updatedAudioContext) {
    //     alert("Impossible d'initialiser l'audio.");
    //     return;
    //   }

    //   console.log("État audio après update :", updatedAudioContext.state);

    //   if (updatedAudioContext.state === "suspended") {
    //     setShowModal(true);
    //     return;
    //   }

    //   if (updatedAudioContext.state !== "running") {
    //     alert(
    //       "L'activation de l'audio sur ce site par votre navigateur est requise pour lancer une partie. Veuillez activer l'audio et réessayer."
    //     );
    //     return;
    //   }
    // } catch (error) {
    //   alert(
    //     "Votre navigateur ne supporte pas l'API audio nécessaire pour cette application. Veuillez réessayer en changeant de navigateur."
    //   );
    //   return;
    // }

    // if everything ok, launches the game
    handleLaunchGame();
  };

  return (
    <div>
      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="text-center w-72">
            <div className="mx-auto my-4 w-64">
              <h3 className="text-lg font-black text-gray-800">
                Activation de l'audio requise
              </h3>
              <p className="text-sm text-gray-500">
                Vous devez activer l'audio dans votre navigateur pour pouvoir
                lancer la partie. Une fois cela fait, vous pouvez recliquer sur
                lancer la partie
              </p>
              <button
                className="bg-green-600 px-5 py-2.5 rounded-lg text-white"
                type="button"
                // onClick={handleAudioAcceptance}
                onClick={handleClick}
              >
                Activer l'audio pour ce site
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex gap-2">
        <h2>Présentateur :</h2>
        <input type="checkbox" checked={presentator != null} readOnly />
      </div>

      <div className="flex mb-4 justify-around">
        <div className="w-1/2">
          <h2 className="mb-2">
            Joueurs dans la salle :{" "}
            <span className="ms-3 px-3 py-1 rounded-lg bg-white text-black font-bold">
              {players.length}
            </span>
          </h2>

          <ul className="h-80 overflow-y-scroll grid grid-cols-4 border border-white">
            {players && players.length > 0 ? (
              players.map((player) => (
                <li
                  key={player.userId}
                  className="flex flex-col items-center gap-2 p-2"
                >
                  <img
                    src="/assets/circle-user-solid.svg"
                    style={{ width: "32px" }}
                  />
                  <p>
                    {player.pseudo}{" "}
                    {/*player.socketId === socket.id ? "(You)" : ""*/}
                  </p>
                  <button type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 512 512"
                      width={24}
                    >
                      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                    </svg>
                  </button>
                </li>
              ))
            ) : (
              <li className="col-span-4 p-2">Aucun joueur pour le moment</li>
            )}
          </ul>
        </div>

        <div className="flex items-center justify-items-center">
          <button
            className="bg-green-600 px-5 py-2.5 rounded-lg disabled:bg-green-300 disabled:cursor-not-allowed"
            disabled={!players.length > 0}
            onClick={() => handleClick()}
          >
            Lancer la partie
          </button>
        </div>
      </div>
    </div>
  );
}
