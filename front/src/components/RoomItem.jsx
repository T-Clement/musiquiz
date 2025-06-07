import LinkWithViewTransition from './LinkWithViewTransition';

// assets
import svgPlay from '/assets/play.svg';
import svgCup from '/assets/cup.svg'



export function RoomItem({room}) {
  
  // conditionnal values because api responses are not in the same format ...
  const roomId = room?.id ?? room?.room_id;
  const roomName = room?.name ?? room?.room_name;
  const bestPlayerPseudo = room?.game?.pseudo_user ?? room?.best_player?.pseudo;
  const bestPlayerScore = room?.game?.score ?? room?.best_player?.best_score;


  return (
    <article className='flex flex-col gap-y-4'>
      <div className='flex flex-wrap'>


        <div className='w-[280px] sm:w-[300px] bg-violet-900 flex rounded-lg items-stretch shadow-lg'>

          <div className='basis-1/2 flex justify-center items-center px-4 py-8'>
            <LinkWithViewTransition className='relative p-5 rounded-full transform transition duration-500 hover:scale-125' to={`/room/${roomId}`}>
              <img src={svgPlay} alt="Play Icon" className="relative z-10 ps-1 w-8 h-8 fill-current text-white"/>
              <span className="absolute inset-0 rounded-full bg-white opacity-25"></span>
            </LinkWithViewTransition>
          </div>

          <div className='flex flex-row basis-1/2 justify-center items-center gap-2 px-4 py-8 relative'>

            <div className='absolute bg-black opacity-30 inset-0 rounded-r-lg'></div>

            <img src={svgCup} alt="Winner cup, for the current bestplayer of the room" className="w-10 h-10 z-10"/>
            
            <ul className='flex flex-col z-10'>

              {bestPlayerPseudo ? 
              <>
                <li className='truncate'>{bestPlayerPseudo}</li>
                <li className='truncate'>{bestPlayerScore} pts</li>
              </>
              :
              <li>Aucune partie</li>
            }


            </ul>
          </div>

        </div>
      </div>

      <h3 className='text-2xl'>{roomName}</h3>

    </article>
  )
}
