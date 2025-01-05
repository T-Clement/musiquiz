import React from 'react'
import FlipMove from 'react-flip-move';

export default function LeaderBoard({ players, setPlayers }) {

    // const moveItem = (dragIndex, hoverIndex) => {
    //     const draggedItem = players[dragIndex];
    //     const remainingsItems = players.filter((_, index) => index !== dragIndex);
    //     remainingsItems.splice(hoverIndex, 0, draggedItem);
    //     setPlayers(remainingsItems);
    // }


    return (
        <table className='w-full text-sm text-left'>
            <thead className='text-xs uppercase border-b-2 bg-slate-600'>
                <tr>
                    <th scope='col' className='px-6 py-3'>Classement</th>
                    <th scope='col' className='px-6 py-3'>Pseudo</th>
                    <th scope='col' className='px-6 py-3'>Score</th>
                </tr>
            </thead>
            {/* <tbody className='max-h-20 overflow-y-scroll'> */}
                <FlipMove className='' tagName="tbody">
                    {/* {players.map((player, index) => (<p key={player.userId}>{player.pseudo} - Socket: {player.socketId} - Score: {player.score}</p>))} */}
                    {players.map((player, index) => (
                        // <tr key={ player.userId } className='border-b' onMove={ () => moveItem(index) }>
                        <tr key={ player.userId } className='border-b'>
                            <th scope="row" className='px-6 py-4 font-medium whitespace-nowrap'>{index + 1}</th>
                            <td className='px-6 py-4'>{player.pseudo}</td>
                            <td className='px-6 py-4'>{player.score}</td>
                        </tr>

                    ))}

                </FlipMove>
                    {/* <tr className='border-b'>
                        <th scope="row" className='px-6 py-4 font-medium whitespace-nowrap' onMove={ () => moveItem(3)}>2</th>
                        <td className='px-6 py-4'>TEST</td>
                        <td className='px-6 py-4'>0</td>
                    </tr> */}

            {/* </tbody> */}

        </table>
    )
}
