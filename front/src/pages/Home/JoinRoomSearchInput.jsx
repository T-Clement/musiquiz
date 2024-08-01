import React from 'react'

function JoinRoomSearchInput({ errorMessage, onChangeInput, onSubmitForm, roomCode }) {
    return (
        <>
            <form className="" action='' method='' onSubmit={onSubmitForm}>
                <input className="border border-gray rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:ring-inset" type="search" name="roomCode" onChange={onChangeInput} value={roomCode} />
                <input className="border border-gray px-1" type='submit' value="Rejoindre" />
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
    )
}

export default JoinRoomSearchInput