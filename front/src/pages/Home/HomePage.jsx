import { useState } from "react";

import JoinGameSection from "./JoinGameSection";
import { Link, useLoaderData } from "react-router-dom";

// import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper styles
import "swiper/swiper-bundle.css";
// custom css for swiper
import "../../swiper.css";
// import required modules
import { Navigation } from "swiper/modules";

import { RoomItem } from "../../components/RoomItem";
import Button, { VARIANT_STYLES } from "../../components/Button";
import RandomRoomCard from "./RandomRoomCard";
import DashboardCard from "../../components/DashboardCard";

export async function loader() {
  // console.log(import.meta.env.VITE_API_URL);
  const top3 = await fetch(`${import.meta.env.VITE_API_URL}/api/top3`).then(
    (response) => response.json()
  );
  // console.log(top3)
  const themes = await fetch(`${import.meta.env.VITE_API_URL}/api/theme`).then(
    (response) => response.json()
  );
  return { top3, themes };
}

export function HomePage() {
  console.log("Render HomePage");

  // Loader

  // if no current room at this id -> show error message

  // else if current room at this id -> navigate to it

  // get data coming from react-router loader
  const { top3, themes } = useLoaderData();

  // console.log(top3, themes);

  return (
    <div className="px-4 mb-4">
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Rejoindre une partie</h2>
        <JoinGameSection />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Top 3</h2>
        {/* <p>
          Voici les parties les plus jouées du site. Vous pensez être meilleur
          qu'eux, à vous de jouer !
        </p> */}
        <ul className="mt-6 flex flex-col lg:flex-row gap-12 lg:gap-12 items-center md:flex-wrap">
          {/* min-[320px]: */}
          {top3.map((room, index) => (
            <li
              key={room.id}
              className="flex max-[320px]:flex-col min-[300px]:gap-y-4 sm:flex-row items-center gap-x-5"
            >
              <span className="text-6xl">{index + 1}</span>

              <RoomItem room={room} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Themes</h2>

        <Swiper
          direction="horizontal"
          loop={true} // disabled loop
          navigation={{
            nextEl: ".swiper-button-next", // class for next btn
            prevEl: ".swiper-button-prev", // class for previous btn
          }}
          modules={[Navigation]} // add navigation module
          breakpoints={{
            // breakpoints to config displaying of slides
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
          {themes.map((theme) => (
            <SwiperSlide key={theme.id}>
              <div className="slide-content">
                <Link
                  to={`theme/${theme.id}`}
                  className="swiper-theme-link uppercase font-semibold p-6"
                >
                  {theme.name}
                </Link>
              </div>
            </SwiperSlide>
          ))}

          {/* nav buttons */}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2 items-stretch">

        <DashboardCard icon="🎲" title="Partie aléatoire">
          <RandomRoomCard onJoin={ '' } />
        </DashboardCard>

        <DashboardCard icon="🏠" title="Toutes les rooms">
          <p className="text-gray-300 mb-4">
            Parcourez toutes les parties disponibles.
          </p>
          <Link
            to="/room"
            className={`${VARIANT_STYLES.blue} flex self-center`}
          >
            Voir les rooms
          </Link>
        </DashboardCard>

      </section>
    </div>
  );
}
