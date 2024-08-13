import React from 'react'
import { useLoaderData, useParams } from 'react-router-dom';

export async function loader({ request, params }) {
    // console.log(request, params);
    // let {id} = useParams();
    // console.log(id);
    const roomData = await fetch(`http://localhost:3000/api/room/${params.id}`).then(response => response.json());
    // console.log(roomData);
    return { roomData }

}


export function RoomPage() {

    let { id } = useParams();

    console.log(`In room page id ${id}`);

    const { roomData } = useLoaderData();

    console.log(roomData);


    // count of parties played

    // room classement

    // Buttons create multi room custom or default 



    // add datas related to previous games in this room (history of parties ??)


    return (
        <div>
            <p className='mb-6'>RoomPage - id : {id}</p>
            <div className='flex flex-wrap gap-y-6 p-2'>

                <div className="w-full md:w-1/2">
                    <div class="relative overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        #
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Pseudo
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Points
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {roomData.room.scores.map((score, index) =>
                                (<tr key={score.id} className='bg-white border-b'>
                                    <td className='px-6 py-4 text-gray-900'>{index + 1}</td>
                                    <td className='px-6 py-4 text-gray-900'>{score.pseudo_user}</td>
                                    <td className='px-6 py-4 text-gray-900'>{score.score} pts</td>
                                </tr>)
                                )}

                            </tbody>
                        </table>
                    </div>


                </div>

                <div className='w-full md:w-1/2 flex flex-col justify-center items-center'>
                    <h3>Multijoueur</h3>
                    <div className='flex flex-col gap-3 mt-6'>
                        <button type='button' className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Créer une partie</button>
                        <button type='button' className='cursor-not-allowed text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700' disabled>Créer une partie <br /> personnalisée</button>
                    </div>
                </div>


            </div>
        </div>
    )
}
