import React, { useState } from 'react'

import JoinGameSection from './JoinGameSection';

export function HomePage() {

    // Loader 

    // if no current room at this id -> show error message
    
    // else if current room at this id -> navigate to it

    
    // check if room exists -> API

    //


  

  return (

    <div>

      <section>
        <h2 className='mt-8'>Rejoindre une partie</h2>
        <JoinGameSection />
      </section>

      <section>
        <h2>Top 3</h2>
        <div>
          FAIRE APPEL A LA VUE DANS LA BDD
        </div>
      </section>
      
    </div>
  )
}

// export default HomePage