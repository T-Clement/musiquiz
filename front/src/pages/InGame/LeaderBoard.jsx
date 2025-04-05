import React from 'react'
import FlipMove from 'react-flip-move';

export default function LeaderBoard({ players, setPlayers }) {

    return (
        <table className='w-full text-sm text-left'>
            <thead className='text-xs uppercase border-b-2 bg-slate-600'>
                <tr>
                    <th scope='col' className='px-6 py-3'>Classement</th>
                    <th scope='col' className='px-6 py-3'>Pseudo</th>
                    <th scope='col' className='px-6 py-3'>Score</th>
                </tr>
            </thead>
            
            <FlipMove className='' typeName="tbody">
                {players.map((player, index) => (
                    <tr key={ player.userId } className='border-b'>
                        <th scope="row" className='px-6 py-4 font-medium whitespace-nowrap'>{index + 1}</th>
                        <td className='px-6 py-4'>{player.pseudo}</td>
                        <td className='px-6 py-4'>{player.score}</td>
                    </tr>

                ))}

            </FlipMove>

        </table>
    )
}
