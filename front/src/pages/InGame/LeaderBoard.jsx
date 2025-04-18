import React, { useEffect, useState } from 'react'
import FlipMove from 'react-flip-move';

export default function LeaderBoard({ players, setPlayers, socket, currentRound }) {

    const [answeredSet, setAnsweredSet] = useState(new Set());

    // reset Set at each new round
    useEffect(() => {
        setAnsweredSet(new Set());
    }, [socket]);


    useEffect(() => {
        if(!socket) return;
        const onAnwser = ({ userId }) => {
            setAnsweredSet(prev => {
                const next = new Set(prev);
                next.add(userId);
                return next;
            });
        };
        socket.on('player-answered', onAnwser);
        return () => socket.off('player-anwsered', onAnwser);
    })

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
                {players.map((player, index) => {
                const isAnswered = answeredSet.has(player.userId);
                return (
                    <tr 
                        key={ player.userId } 
                        className={[
                        'border-b',
                        'transition-all duration-500',
                        isAnswered && 'bg-green-200 ring-4 ring-green-400 animate-pulse'
                        ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                        <th scope="row" className='px-6 py-4 font-medium whitespace-nowrap'>{index + 1}</th>
                        <td className='px-6 py-4'>{player.pseudo}</td>
                        <td className='px-6 py-4'>{player.score}</td>
                    </tr>

                )})}

            </FlipMove>

        </table>
    )
}
