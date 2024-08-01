import React from 'react'
import { useParams } from 'react-router-dom';

export function RoomPage() {

    let { id } = useParams();

    console.log(`In room page id ${id}`);



    // room classement

    // Buttons create multi room custom or default 




  return (
    <div className='p-2'>
        <p className='mb-6'>RoomPage - id : {id}</p>
        {/* Scoreboard */}
        <div className='border w-full border-white'>
           
           <div className='w-full md:w-1/3 bg-cyan-800'> 
                <table className='w-full border border-lime-800 h-[400px]'>
                    <thead>
                        <tr className='flex flex-row gap-x-4'>
                            <th className=''>#</th>
                            <th className='me-auto'>User</th>
                            <th className='pe-2'>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='flex flex-row gap-x-4 py-4'>
                            <td className=''>1</td>
                            <td className='me-auto'>ClemClemeClem</td>
                            <td className='pe-2'>7000 pts</td>
                        </tr>
                        <tr className='flex flex-row gap-x-4 py-4'>
                            <td className=''>1</td>
                            <td className='me-auto'>Clem</td>
                            <td className='pe-2'>7000 pts</td>
                        </tr>
                        <tr className='flex flex-row gap-x-4 py-4'>
                            <td className=''>1</td>
                            <td className='me-auto'>Clem</td>
                            <td className='pe-2'>7000 pts</td>
                        </tr>
                        <tr className='flex flex-row gap-x-4 py-4'>
                            <td className=''>1</td>
                            <td className='me-auto'>Clem</td>
                            <td className='pe-2'>7000 pts</td>
                        </tr>
                    </tbody>
                </table>
           </div>



        </div>


    </div>
  )
}
