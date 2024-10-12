// import React from 'react'

function JoinRoomSearchInput({ errorMessage, onChangeInput, onSubmitForm, roomCode }) {
    


    return (
        <>
            <form className="flex flex-col md:flex-row gap-y-3 md:gap-4" action='' method='' onSubmit={onSubmitForm}>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="search" name="roomCode" onChange={onChangeInput} value={roomCode} />
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type='submit'>Rejoindre</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
    )
}

export default JoinRoomSearchInput