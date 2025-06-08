import { Link } from "react-router-dom";

export default function SimpleRoomTile({ room }) {
  return (
    <Link to={`/room/${room.room_id}`}
      
      className="relative flex flex-col gap-3 p-4 w-56
                 rounded-xl bg-purple-800/80 backdrop-blur
                 ring-1 ring-violet-600/40 hover:ring-violet-400
                 transition shadow-lg"
    >
      <h4 className="text-lg font-semibold text-white leading-snug">
        {room.room_name}
      </h4>
    </Link>
  );
}
