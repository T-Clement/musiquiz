
import JoinGameSection from "./JoinGameSection";
import { useLoaderData } from "react-router-dom";

// import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper styles
import "swiper/swiper-bundle.css";
// custom css for swiper
import "../../swiper.css";
// import required modules
import { Navigation } from "swiper/modules";

import { RoomItem } from "../../components/RoomItem";
import { VARIANT_STYLES } from "../../components/Button";
import RandomRoomCard from "./RandomRoomCard";
import DashboardCard from "../../components/DashboardCard";
import LinkWithViewTransition from "../../components/LinkWithViewTransition";
import Heading2 from "../../components/Heading2";
// import { useRenderLogger } from "../../hooks/useRenderLogger";

export async function loader() {
  const top3 = await fetch(`${import.meta.env.VITE_API_URL}/api/home/top3`).then(
    (response) => response.json()
  );
  const themes = await fetch(`${import.meta.env.VITE_API_URL}/api/theme`).then(
    (response) => response.json()
  );
  const randomRooms = await fetch(`${import.meta.env.VITE_API_URL}/api/room/random`).then(
    (response) => response.json()
  );
  return { top3, themes, randomRooms };
}



export function HomePage() {
  
  // useRenderLogger("Homepage");  
  // console.log("Render HomePage");

  // get data coming from react-router loader
  const { top3, themes, randomRooms } = useLoaderData();



  return (
    <div className="px-4 mb-4">
      <section className="mt-8">
        <Heading2 additionnalClasses="mb-2">Rejoindre une partie</Heading2>
        <JoinGameSection />
      </section>

      <section className="mt-8">
        <Heading2 additionnalClasses="uppercase">Top 3</Heading2>
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
              <span className="text-8xl">{index + 1}</span>

              <RoomItem room={room} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <Heading2 additionnalClasses="uppercase">Themes</Heading2>

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
                <LinkWithViewTransition
                  to={`theme/${theme.id}`}
                  className="swiper-theme-link uppercase font-semibold p-6"
                >
                  {theme.name}
                </LinkWithViewTransition>
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
          <RandomRoomCard intialRandomRoomsPool = { randomRooms.rooms } onJoin={ '' } />
        </DashboardCard>

        <DashboardCard icon="🕹️" title="Toutes les rooms">
          <p className="text-gray-300 mb-4">
            Parcourez toutes les parties disponibles.
          </p>
          <LinkWithViewTransition
            to="/room/browse"
            className={`${VARIANT_STYLES.blue} flex self-center`}
          >
            Voir les rooms
          </LinkWithViewTransition>
        </DashboardCard>

      </section>
    </div>
  );
}
