import React from 'react'

export default function WaitingRoomPresentator({players, presentator, socket}) {
    return (
        <div>
            <div className='flex gap-2'>
                <h2>Présentateur :</h2>
                <input type='checkbox' checked={presentator != null} readOnly />
            </div>
            
            

            <div className='flex mb-4 justify-around'>

                <div className='w-1/2'>

                    <h2 className='mb-2'>Joueurs dans la salle : <span className='ms-3 px-3 py-1 rounded-lg bg-white text-black font-bold'>{players.length}</span></h2>
                    
                    {players && players.length > 0 ? (
                        <ul className='h-80 overflow-y-scroll grid grid-cols-4 border border-white'>
                            {players.map(player => (
                                <li key={player.userId} className='flex flex-col items-center gap-2 p-2'>
                                    <img src='/public/assets/circle-user-solid.svg' style={{width: '32px'}}/>
                                    <p>{player.pseudo} {/*player.socketId === socket.id ? "(You)" : ""*/}</p>
                                    <button type='button'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 512 512" width={24}>
                                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucun joueur pour le moment</p>
                    )}

                </div>



                <div className='flex items-center justify-items-center'>
                    
                    <button 
                        className='bg-green-600 px-5 py-2.5 rounded-lg disabled:bg-green-300 disabled:cursor-not-allowed'
                        disabled={! players.length > 0}
                    >
                        Lancer la partie
                    </button>

                </div>



            </div>




        </div>
    )
}
