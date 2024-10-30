// import React from 'react'
import apiAxios from '../libs/axios';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import { useWebSocket } from '../layouts/GameLayout';


// vérifier si le joueur est connecté
// si non, ne laisser le choix que du rôle de présentateur
// si oui, laisser le choix de rôle

// une fois cliqué sur le rôle, envoyer les données au serveur
// si retour json positif, rediriger vers la page waiting room



export async function loader() {
    console.log("choose role loader")
    try {
        const response = await apiAxios.get(`${import.meta.env.VITE_API_URL}/api/me`);
        console.warn(response.data);
        return response.data.user || null;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("User not authenticated");
            return null;
        }else {
            console.error("dans le else");
            console.error(error);
        }
        throw error; // Rethrow other errors
    }


    // check if user is not already in game ? (prev in navigator go back to role selection page ...)

}



function ChooseRole() {

    const user = useLoaderData();
    // console.warn(user)

    const { id: gameId } = useParams();

    const navigate = useNavigate();


    const socket = useWebSocket();


    if (!user) {
        // console.log('user not connected');
    } else {
        // console.log('user connected');
    }

    // if(!socket) return <div>Loading ...</div>;

    console.warn(socket);

    const handleChooseRole = async (role) => {
        console.log('choix du rôle : ', role);
        console.log(user)
        console.log(gameId);
        console.log(socket.id);

        try {
            // send role to server
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/game/add-user-to-game`, {
                role: role,
                userId: user ? user.userId : "",
                gameId: gameId,
                socketId: socket.id || null
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });




            // console.log(response);
            // if response is ok, redirect to waiting room
            if (response.data) {

                // after valid api response, emit websocket event
                socket.emit('join-room', gameId, user ? user.userId : null, role);


                navigate(`/game/${gameId}/waiting-room`, { state: { game: response.data, userId: user ? user.userId : null, role } });
            }

        } catch (error) {
            console.error('Error in ChooseRole page', error);
            // navigate('/');
        }



    }






    if(!socket) {
        return <p>Waiting for websocket ...</p>
    }



    return (
        <div>
            <h1>ChooseRole</h1>

            <div>
                <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Choisissez votre rôle</h1>
                        <p className="text-center text-gray-600 mb-8">
                            Sélectionnez le rôle que vous souhaitez jouer dans cette partie.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <button
                                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                type='button'
                                onClick={() => handleChooseRole('presentator')}
                            >Présentateur</button>
                            <button
                                className="disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                type='button'
                                disabled={!user}
                                onClick={() => handleChooseRole('player')}
                            >Joueur</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChooseRole