import React from 'react'

export default function RoundsSection({rounds}) {
  
  console.log(rounds);
return (

    <ul role="list" className="divide-y divide-gray-100 bg-slate-600 rounded-lg">
        {rounds.map(round => 
            (
            <li className="flex flex-col justify-between gap-x-6 px-3 py-5 min-w-64 md:min-w-[420px]">
                <div className="flex min-w-0 gap-x-4">
                {/* <img className="size-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/> */}
                <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 font-semibold text-slate-50">{ round.artist }</p>
                    <p className="mt-1 truncate text-xs/5 text-slate-50">leslie.alexander@example.com</p>
                    <p className='mt-1 text-xs/5 flex justify-end bg-b' ><a target="_blank" className="bg-blue-900 underline p-2 text-slate-50">Ecouter l'extrait</a></p>
                </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                {/* <p className="text-sm/6 text-gray-900">Co-Founder / CEO</p>
                <p className="mt-1 text-xs/5 text-gray-500">Last seen <time datetime="2023-01-23T13:23Z">3h ago</time></p> */}
                </div>
            </li>

            )
        )}
        
    </ul>



    )
}
