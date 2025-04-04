import React from "react";
import { Link } from "react-router-dom";

import svgPlay from "/assets/play.svg";

export default function RoundsSection({ rounds }) {
  console.log(rounds);
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 bg-slate-600 rounded-lg"
    >
      {rounds.map((round) => (
        <li className="flex flex-col justify-between gap-x-6 px-6 py-5 min-w-64 md:min-w-[420px]">
          <div className="flex justify-between min-w-0 gap-x-4">
            <div className="flex-col self-center">
              <p className="font-semibold text-slate-50">{round.artist}</p>
              <p className="mt-1 truncate text-slate-50 italic">{round.title}</p>
            </div>
            <a
              target="_blank"
              className="p-4 text-slate-50 relative text-xs/5 flex flex-col items-center "
              href={round.songExtract}
            >
              <img
                src={svgPlay}
                alt="Play Icon"
                className="relative z-10 ps-1 w-8 h-8 fill-current text-white"
                />
                <p>Ecouter l'extrait</p>
              <span className="absolute inset-0 rounded-full bg-white opacity-25"></span>
            </a>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end"></div>
        </li>
      ))}
    </ul>
  );
}
