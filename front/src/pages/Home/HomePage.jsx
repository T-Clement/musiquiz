import React, { useState } from 'react'

import JoinGameSection from './JoinGameSection';
import { Link } from 'react-router-dom';

export function HomePage() {

    // Loader 

    // if no current room at this id -> show error message
    
    // else if current room at this id -> navigate to it

    
    // check if room exists -> API

    //


  

  return (

    <div className='px-4'>

      <section className='mt-8'>
        <h2 className=''>Rejoindre une partie</h2>
        <JoinGameSection />
      </section>

      <section className='mt-8'>
        <h2>Top 3</h2>
        <div className='flex flex-col'>
          
          <Link className='underline' to={"/room/1"} >Room 1</Link>
          <Link className='underline' to={"/room/2"} >Room 2</Link>
          <Link className='underline' to={"/room/3"} >Room 3</Link>

        </div>
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