import Spinner from '../../components/Spinner'

export default function WaitingRoomPlayer({ presentator }) {

    // add presence of presentator in this view ???

  return (
    <div className='max-w-sm mx-auto my-8 flex flex-col gap-6 items-center'>
        <label>Présentateur : <input type='checkbox' checked={presentator != null} readOnly/></label>
        <h2 className='text-center font-bold text-xl px-10'>
            {presentator ? "En attente du lancement de la partie par le présentateur" :
            "En attente d'un présentateur pour la partie"
            }
            </h2> 
        <Spinner />
    </div>
  )
}
