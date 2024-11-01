import React from 'react'

export default function WaitingRoomPresentator({players, presentator, socket}) {
    return (
        <div>
            <h2>Joueurs dans la salle :</h2>
            {players && players.length > 0 ? (
                <ul>
                    {players.map(player => (
                        <li key={player.userId}>{player.pseudo} {player.socketId === socket.id ? "(You)" : ""} - {player.socketId}</li>
                    ))}
                </ul>
            ) : (
                <p>Aucun joueur pour le moment</p>
            )}


            <div className='flex gap-2'>
                <h2>Présentateur :</h2>
                <input type='checkbox' checked={presentator != null} readOnly />
            </div>


            <button 
                className='bg-green-600 px-5 py-2.5 rounded-lg disabled:bg-green-300 disabled:cursor-not-allowed'
                disabled={! players.length > 0}
            >
                Lancer la partie
            </button>



        </div>
    )
}
