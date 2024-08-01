import React from 'react'
import { useParams } from 'react-router-dom';

export function RoomPage() {

    let { id } = useParams();

    console.log(`In room page id ${id}`);



    // room classement

    // Buttons create multi room custom or default 




  return (
    <div>
        RoomPage - id : {id}
    </div>
  )
}
