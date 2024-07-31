import React from 'react'

function JoinRoomSearchInput({errorMessage, onChangeInput, onSubmitForm, roomCode}) {
  return (
    <>
    <form action='' method='' onSubmit={onSubmitForm}> 
        <input type="search" name="roomCode" onChange={onChangeInput} value={roomCode}/>
        <input type='submit' value="Rejoindre"/>
    </form>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </>
  )
}

export default JoinRoomSearchInput