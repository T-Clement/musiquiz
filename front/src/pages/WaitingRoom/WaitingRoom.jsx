import QRCode from "react-qr-code";
import Button from "../../components/Button";
import { useState } from "react";
import Separator from "../../components/Separator";
import Heading2 from "../../components/Heading2";
import Modal from "../../components/Modal";

export function WaitingRoom({ role, players, presentator, game, onKick, onLaunch, onQuit }) {
  // HELPLERS 
  const isHost   = role === "presentator";
  const canStart = isHost && players.length > 0;

  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);

  return (
    <div className="mt-6 flex flex-col items-center gap-3 md:gap-10 px-4">

      {/* Title  */}
      <Heading2 additionnalClasses="text-2xl text-center uppercase mb-2">Salle d&apos;attente</Heading2>
      <Separator additionnalClasses="w-60 md:w-[600px] flex mx-auto"/>

      <div className="flex flex-col md:flex-row items-center md:justify-center gap-10">
      
        {/* SharingCode */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg">Code pour rejoindre :</p>
          <span className="px-6 py-3 bg-white/10 rounded-lg font-mono font-black text-2xl tracking-widest text-white">
            {game.sharingCode}
          </span>
        </div>

        {/* QrCode and QrCode Modal */}
        <div className="p-4 bg-white/5 rounded-xl ring-1 ring-white/10">
          <div>
          <QRCode
            size={240}
            value={`${window.location.origin}/game/${game._id}/choose-role?sharingCode=${game.sharingCode}`}
            onClick={() => setIsQrCodeModalOpen(true)}
          />
          {isQrCodeModalOpen &&
          <Modal 
            open={isQrCodeModalOpen} 
            onClose={() => setIsQrCodeModalOpen(false)}
          >
            <QRCode
            size={340}
            value={`${window.location.origin}/game/${game._id}/choose-role?sharingCode=${game.sharingCode}`}
          />
          </Modal>
          }
          </div>
        </div>


      </div>

      {/* presentator status */}
      <div className="flex items-center gap-2 text-slate-200">
        <span>Présentateur :</span>
        <input type="checkbox" readOnly checked={presentator != null} />
      </div>

      {/* players list */}
      <section className="w-full max-w-lg">
        <h2 className="text-lg font-semibold text-slate-200 mb-2">
          Joueurs dans la salle&nbsp;: <span className="bg-white rounded-lg px-2 py-[3px] text-gray-700">{players.length}</span>
        </h2>

        <ul className="rounded-lg bg-white/5 backdrop-blur ring-1 ring-white/10
                       divide-y divide-white/10 max-h-64 overflow-y-auto">
          {players.length ? players.map((p) => (
            <li key={p.userId} className="flex items-center gap-3 px-4 py-3 text-slate-100">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/>
              </svg>
              <span className="flex-1">{p.pseudo}</span>

              {/* kick player only if host */}
              {isHost && (
                <button onClick={() => onKick(p.userId)}
                        className="text-slate-400 hover:text-slate-50 transition">
                  ✕
                </button>
              )}
            </li>
          )) : (
            <li className="px-4 py-6 text-center text-slate-400">Aucun joueur pour le moment</li>
          )}
        </ul>
      </section>

      {/* actions buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <Button variant="blue" onClick={onQuit}>Quitter</Button>

        {isHost && (
          <Button variant="success" disabled={!canStart}
                  className="disabled:opacity-40"
                  onClick={onLaunch}>
            Lancer la partie
          </Button>
        )}
      </div>
    </div>
  );
}
