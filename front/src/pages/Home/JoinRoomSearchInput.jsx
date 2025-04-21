// import React from 'react'

import Button from "../../components/Button"

function JoinRoomSearchInput({ errorMessage, onChangeInput, onSubmitForm, roomCode }) {
    


    return (
        <>
            <form className="flex flex-col md:flex-row gap-y-3 md:gap-4" action='' method='' onSubmit={onSubmitForm}>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="search" name="roomCode" onChange={onChangeInput} value={roomCode} autoComplete="off" />
                <Button 
                    variant="blue"
                    type='submit'
                >
                    Rejoindre
                </Button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
    )
}

export default JoinRoomSearchInput