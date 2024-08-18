import React, { useState } from 'react'

import JoinGameSection from './JoinGameSection';
import { Link, useLoaderData } from 'react-router-dom';



// import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import Swiper styles
import 'swiper/swiper-bundle.css';
// custom css for swiper
import "../../swiper.css";
// import required modules
import { Navigation } from 'swiper/modules';




import { RoomItem } from '../../components/RoomItem';

export async function loader() {
  const top3 = await fetch("http://localhost:3000/api/top3").then(response => response.json());
  // console.log(top3)
  const themes = await fetch("http://localhost:3000/api/theme").then(response => response.json());
  return {top3, themes};
}



export function HomePage() {


  console.log("Render HomePage");

    // Loader 

    // if no current room at this id -> show error message
    
    // else if current room at this id -> navigate to it


  // get data coming from react-router loader
  const { top3, themes } = useLoaderData();

  console.log(top3, themes);
  

  

  return (

    <div className='px-4'>

      <section className='mt-8'>
        <h2 className='text-2xl mb-4'>Rejoindre une partie</h2>
        <JoinGameSection />
      </section>

      <section className='mt-8'>
        <h2 className='text-2xl'>Top 3</h2>
        <ul className='mt-6 flex flex-col lg:flex-row gap-12 lg:gap-12 items-center md:flex-wrap'>
          
        {/* min-[320px]: */}
        {top3.map((room, index) => 
          <li key={room.id} className='flex max-[320px]:flex-col min-[300px]:gap-y-4 sm:flex-row items-center gap-x-5'>
            
            <span className='text-6xl'>{index +1}</span>
            
            <RoomItem room = {room} />
            

          </li>
        )}
          

        </ul>
      </section>
      
      <section className='mt-8'>
        <h2>Themes</h2>

        <Swiper
          direction="horizontal" 
          loop={false} // disabled loop
          navigation={{
            nextEl: '.swiper-button-next', // class for next btn
            prevEl: '.swiper-button-prev', // class for previous btn
          }}
          modules={[Navigation]} // add navigation module
          breakpoints={{ // breakpoints to config displaying of slides
            480: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
            // 770: {
            600: {
              slidesPerView: 2,
              spaceBetween: 80,
            },
            1028: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
        >
          {themes.map(theme => (
            <SwiperSlide key={theme.id}>
            
              <div className="slide-content">
                <Link to={`theme/${theme.id}`} className='swiper-theme-link uppercase font-semibold'>{theme.name}</Link>
              </div>
            </SwiperSlide>
            ))}
          
          
          
          {/* nav buttons */}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>





      </section>

      <section className='mt-8'>
        <p>Random</p>
      </section>



    </div>
  )
}

// export default HomePage