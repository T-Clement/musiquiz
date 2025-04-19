import React, { useEffect, useRef, useState } from 'react'
import FlipMove from 'react-flip-move';

export default function LeaderBoard({ players, setPlayers, socket, currentRound }) {

    const [answeredSet, setAnsweredSet] = useState(new Set());
    const [animatingSet, setAnimatingSet] = useState(new Set());
    const timeouts = useRef({});


    // reset Set at each new round
    useEffect(() => {
        setAnsweredSet(new Set());
        setAnsweredSet(new Set());

        // clear all timeouts
        Object.values(timeouts.current).forEach(clearTimeout);
        timeouts.current = {};
    }, [currentRound]);


    useEffect(() => {
        if(!socket) return;
        const onAnwser = ({ userId }) => {
            setAnsweredSet(prev => {
                const next = new Set(prev);
                next.add(userId);
                return next;
            });
            setAnimatingSet(prev => {
                if(prev.has(userId)) return prev;
                const next = new Set(prev);
                next.add(userId);
                
                // remove animation after 1 sec
                timeouts.current[userId] = setTimeout(() => {
                setAnimatingSet(curr => {
                    const s = new Set(curr);
                    s.delete(userId);
                    return s;
                });
                delete timeouts.current[userId];
                }, 1000);
                return next;
            });
        };
        socket.on('player-answered', onAnwser);
        return () => {
            socket.off('player-anwsered', onAnwser);
            Object.values(timeouts.current).forEach(clearTimeout);
            timeouts.current = {};
        }
    }, [socket])

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
                const hasAnswered = answeredSet.has(player.userId);
                const isAnimating = animatingSet.has(player.userId);

                const staticBg = hasAnswered && !isAnimating ? 'bg-green-200' : '';
                const flash   = isAnimating               ? 'flash-answer' : '';

                return (
                    <tr 
                        key={ player.userId } 
                        className={[
                            'border-b',
                            'transition-colors duration-300',
                            staticBg,
                            flash
                        ].filter(Boolean).join(' ')}
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
