import React from 'react'
import { Link, useParams } from 'react-router-dom'




function WaitingRoom() {

  let { id } = useParams();
  console.log(id);




  return (
    <>
      <Link to={'/'}>Home</Link>
      <div>WaitingRoom</div>
    </>
  )
}

export default WaitingRoom