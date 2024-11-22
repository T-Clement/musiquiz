import React from 'react'

export default function LeaderBoard({ players }) {
    return (
        <table className='w-full text-sm text-left'>
            <thead className='text-xs uppercase border-b-2 bg-slate-600'>
                <tr>
                    <th scope='col' className='px-6 py-3'>Classement</th>
                    <th scope='col' className='px-6 py-3'>Pseudo</th>
                    <th scope='col' className='px-6 py-3'>Score</th>
                </tr>
            </thead>
            <tbody>
                {/* {players.map((player, index) => (<p key={player.userId}>{player.pseudo} - Socket: {player.socketId} - Score: {player.score}</p>))} */}
                {players.map((player, index) => (
                    <tr className='border-b'>
                        <th scope="row" className='px-6 py-4 font-medium whitespace-nowrap'>{index + 1}</th>
                        <td className='px-6 py-4'>{player.pseudo}</td>
                        <td className='px-6 py-4'>{player.score}</td>
                    </tr>

                ))}
            </tbody>

        </table>
    )
}
