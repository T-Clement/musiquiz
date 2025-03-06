import React from "react";

const players = [
  {
    id: 1,
    name: "Clifford",
    points: 6794,
    img: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Edgar",
    points: 6453,
    img: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Nevaeh",
    points: 6034,
    img: "https://i.pravatar.cc/150?img=63",
  },
  {
    id: 4,
    name: "Clayton",
    points: 5980,
    img: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Debbie",
    points: 5978,
    img: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Gabriella Steward",
    points: 5845,
    img: "https://i.pravatar.cc/150?img=6",
  },
  // {
  //   id: 7,
  //   name: "Nina Perkins",
  //   points: 5799,
  //   img: "https://i.pravatar.cc/150?img=7",
  // },
  // {
  //   id: 8,
  //   name: "Dennis Henry",
  //   points: 5756,
  //   img: "https://i.pravatar.cc/150?img=8",
  // },
  // {
  //   id: 9,
  //   name: "Courtney Fuller",
  //   points: 5713,
  //   img: "https://i.pravatar.cc/150?img=9",
  // },
  // {
  //   id: 10,
  //   name: "Joan Wood",
  //   points: 5674,
  //   img: "https://i.pravatar.cc/150?img=10",
  // },
];

const sizes = [
  "w-32 h-40 md:w-40 md:h-52", // first place
  "w-32 h-32 md:w-36 md:h-40", // second place
  "w-32 h-28 md:w-32 md:h-33", // third place
];

export default function PlaygroundPage() {
  const topPlayers = players.slice(0, 3);
  const otherPlayers = players.slice(3);

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* top 3 */}
      <div className="flex flex-row gap-4 w-full max-w-lg justify-center items-end mb-6">
        {topPlayers.map((player, index) => {
          let sizeClass;
          if (topPlayers.length === 1) {
            sizeClass = "w-40 h-52 md:w-48 md:h-60";
          } else if (topPlayers.length === 2) {
            sizeClass =
              index === 0
                ? "w-36 h-44 md:w-44 md:h-52"
                : "w-36 h-44 md:w-44 md:h-52";
          } else {
            sizeClass =
              index === 0
                ? "w-32 h-40 md:w-40 md:h-52"
                : index === 1
                ? "w-32 h-32 md:w-36 md:h-40"
                : "w-32 h-28 md:w-32 md:h-33";
          }

          return (
            <div
              key={player.id}
              className={`relative flex flex-col items-center bg-white rounded-lg shadow-md p-4 ${
                sizes[index]
              } ${
                index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"
              } sm:w-full sm:h-auto `}
            >
              <img
                src={player.img}
                alt={player.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white -mt-10"
              />
              <span className="text-xl font-bold text-gray-800">
                {player.id}
              </span>
              <p className="text-center text-sm font-semibold text-gray-700">
                {player.name}
              </p>
              <p className="text-xs text-gray-500">{player.points} points</p>
            </div>
          );
        })}
      </div>

      {/* ranks 4 to end */}
      <div className="w-full max-w-md sm:w-full">
        {otherPlayers.length > 0 ? (
          otherPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center bg-[#E69C81] rounded-full p-2 mb-2 shadow-md"
            >
              <span className="text-white font-bold text-lg ml-3 w-6">
                {player.id}
              </span>
              <img
                src={player.img}
                alt={player.name}
                className="w-10 h-10 rounded-full border-2 border-white mx-2"
              />
              <span className="text-white font-medium flex-grow">
                {player.name}
              </span>
              <span className="text-white text-sm mr-3">
                {player.points} points
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-300">Aucun autre joueur.</p>
        )}
      </div>
    </div>
  );
}
