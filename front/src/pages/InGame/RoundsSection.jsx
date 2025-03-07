import React from 'react'

export default function RoundsSection({rounds}) {
  
  console.log(rounds);
return (

    <ul role="list" classNAme="divide-y divide-gray-100">
        {rounds.map(round => 
            (
            <li class="flex justify-between gap-x-6 py-5">
                <div class="flex min-w-0 gap-x-4">
                <img class="size-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                <div class="min-w-0 flex-auto">
                    <p class="text-sm/6 font-semibold text-gray-900">Leslie Alexander</p>
                    <p class="mt-1 truncate text-xs/5 text-gray-500">leslie.alexander@example.com</p>
                </div>
                </div>
                <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p class="text-sm/6 text-gray-900">Co-Founder / CEO</p>
                <p class="mt-1 text-xs/5 text-gray-500">Last seen <time datetime="2023-01-23T13:23Z">3h ago</time></p>
                </div>
            </li>

            )
        )}
        
    </ul>



    )
}
