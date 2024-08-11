import React from 'react'
import { useLoaderData, useParams } from 'react-router-dom';

export async function loader ({request, params}) {
    // console.log(request, params);
    // let {id} = useParams();
    // console.log(id);
    const roomData = await fetch(`http://localhost:3000/api/room/${params.id}`).then(response => response.json());
    // console.log(roomData);
    return {roomData}

}


export function RoomPage() {

    let { id } = useParams();

    console.log(`In room page id ${id}`);

    const {roomData} = useLoaderData();

    console.log(roomData);


    // count of parties played

    // room classement

    // Buttons create multi room custom or default 



    // add datas related to previous games in this room (history of parties ??)


  return (
    <div className='p-2'>
        <p className='mb-6'>RoomPage - id : {id}</p>
        <div className='border w-full border-white flex flex-col sm:flex-row'>
           
            {/* Scoreboard */}
            <div className='bg-cyan-800 w-full sm:w-2/5'> 
                <table className='border w-full border-lime-800 h-[400px]'>
                    <thead>
                        <tr className='flex flex-row gap-x-4 ps-2'>
                            <th className=''>#</th>
                            <th className='me-auto'>User</th>
                            <th className='pe-2'>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomData.room.scores.map((score, index) => 
                            
                            (<tr key={score.id} className='flex flex-row gap-x-4 py-4 ps-2'>
                                <td className=''>{index + 1}</td>
                                <td className='me-auto'>{score.pseudo_user}</td>
                                <td className='pe-2'>{score.score} pts</td>
                            </tr>)

                        )}

                       
                    </tbody>
                </table>
            </div>

            <div className='w-full sm:w-3/5 flex flex-col justify-center items-center'>
                <h3>Multijoueur</h3>
                <div className='flex flex-col gap-3 mt-6'>
                    <button type='button' className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Créer une partie</button>
                    <button type='button' className='cursor-not-allowed text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700' disabled>Créer une partie <br/> personnalisée</button>
                </div>
            </div>


        </div>


    </div>
  )
}
