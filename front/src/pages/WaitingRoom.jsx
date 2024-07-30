import React from 'react'
import { useParams } from 'react-router-dom'




function WaitingRoom() {

  let { id } = useParams();
  console.log(id);

  return (
    <div>WaitingRoom</div>
  )
}

export default WaitingRoom