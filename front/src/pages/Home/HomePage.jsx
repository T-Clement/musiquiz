import React, { useState } from 'react'

import JoinGameSection from './JoinGameSection';
import { Link, useLoaderData } from 'react-router-dom';

import svgPlay from '../../../public/assets/play.svg';
import svgCup from '../../../public/assets/cup.svg'

export async function loader() {
  const top3 = await fetch("http://localhost:3000/api/top3").then(response => response.json());
  // console.log(top3)
  return {top3};
}



export function HomePage() {

    // Loader 

    // if no current room at this id -> show error message
    
    // else if current room at this id -> navigate to it


  // get data coming from react-router loader
  const { top3 } = useLoaderData();

  console.log(top3);
    
  

  return (

    <div className='px-4'>

      <section className='mt-8'>
        <h2 className=''>Rejoindre une partie</h2>
        <JoinGameSection />
      </section>

      <section className='mt-8'>
        <h2>Top 3</h2>
        <ul className='mt-6 flex flex-col lg:flex-row gap-12 lg:gap-12 '>
          

        {top3.map((room, index) => 
          <li key={room.id} className=''>
            <article className=''>
              <div className='flex flex-wrap'>

                <span>{index +1}</span>

                <div className='w-[280px] sm:w-[300px] bg-violet-900 flex rounded-lg items-stretch shadow-lg'>

                  <div className='basis-1/2 flex justify-center items-center px-4 py-8'>
                    <Link className='relative p-5 rounded-full transform transition duration-500 hover:scale-125' to={`/room/${room.id}`}>
                      <img src={svgPlay} alt="Play Icon" className="relative z-10 ps-1 w-8 h-8 fill-current text-white"/>
                      <span className="absolute inset-0 rounded-full bg-white opacity-25"></span>
                    </Link>
                  </div>

                  <div className='basis-1/2 flex flex-row justify-center items-center gap-2 px-4 py-8 relative'>

                    <div className='absolute bg-black opacity-30 inset-0 rounded-r-lg'></div>

                    <img src={svgCup} alt="" className="w-10 h-10 z-10"/>
                    
                    <ul className='flex flex-col z-10'>

                      <li className='truncate'>{room.game.pseudo_user}</li>
                      <li className='truncate'>{room.game.score} pts</li>

                    </ul>
                  </div>

                </div>
              </div>

              <h3>{room.name}</h3>

            </article>
          </li>
        )}
          

        </ul>
      </section>
      
      <section className='mt-8'>
        <h2>Themes</h2>
        <p>Theme 1</p>
        <p>Theme 2</p>
        <p>Theme 3</p>
      </section>

      <section className='mt-8'>
        <p>Random</p>
      </section>



    </div>
  )
}

// export default HomePage