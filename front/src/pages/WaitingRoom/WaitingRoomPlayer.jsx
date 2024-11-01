import React from 'react'
import Spinner from '../../components/Spinner'

export default function WaitingRoomPlayer({socket}) {

    // add presence of presentator in this view ???

  return (
    <div className='max-w-sm mx-auto my-8 flex flex-col gap-6 items-center'>
        <h2 className='text-center font-bold text-xl'>En attente du lancement de la partie<br/>par le présentateur</h2>
        <Spinner />
    </div>
  )
}
