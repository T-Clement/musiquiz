// import React from 'react'
import apiAxios from '../libs/axios';
import { useLoaderData, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useWebSocket } from '../layouts/GameLayout';
import Button from '../components/Button';
// import {useState} from 'react'

// vérifier si le joueur est connecté
// si non, ne laisser le choix que du rôle de présentateur
// si oui, laisser le choix de rôle

// une fois cliqué sur le rôle, envoyer les données au serveur
// si retour json positif, rediriger vers la page waiting room



export async function loader({request}) {
    console.log("choose role loader")

    const url = new URL(request.url);
    const source = url.searchParams.get('source') || null;
    const sharingCode = url.searchParams.get('sharingCode') || null;

    let user = null;

    // fetch current user
    try {
        const response = await apiAxios.get(`${import.meta.env.VITE_API_URL}/api/me`);
        // console.warn(response.data);
        user =  response.data.user || null;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("User not authenticated");
        }else {
            // console.error("dans le else");
            console.error(error);
            throw error; // rethrow other errors
        }
    }

    return { user, source, sharingCode };

}



export default function ChooseRole() {
    
    const {user, sharingCode} = useLoaderData();
    const {role, setRole} = useOutletContext();
    const { id: gameId } = useParams();
    const navigate = useNavigate();
    
    // console.log('Choose role component Choose role value', role);


    // console.warn(user)

    const {socket, isSocketReady} = useWebSocket();
    const socketInstance = socket.current;

    // const [step, setStep] = useState('');
    // const [error, setError] = useState(null);

    // const handleChooseRole = async (roleInForm) => {

    // }


    const handleChooseRole = async (roleInForm) => {
        console.log('choix du rôle dans le formualaire: ', roleInForm);
        console.log(user)
        console.log(gameId);
        // console.log(socket.id);
        console.log(socketInstance.id);

        try {
            // send role to server
            const response = await apiAxios.post(`${import.meta.env.VITE_API_URL}/api/game/add-user-to-game`, {
                role: roleInForm,
                userId: user ? user.userId : "",
                gameId: gameId,
                socketId: socketInstance.id || null,
                sharingCode: sharingCode
                // token : presentatorToken
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });


            console.log("role in form : ", roleInForm);
            setRole(roleInForm);
            console.log("ICI LE STATE", role);


            // console.log(response);
            // if response is ok, redirect to waiting room
            if (response.data) {

                // after valid api response, emit websocket event
                socketInstance.emit('join-room', gameId, user ? user.userId : null, roleInForm); // not role because state updates 
                                                                                         //are async and it can still be null by the time the data is send via ws event


                navigate(`/game/${gameId}/waiting-room`, { 
                    state: { game: response.data, userId: user ? user.userId : null } 
                });
            }

        } catch (error) {
            console.error('Error in ChooseRole page', error);
            // navigate('/');
        }



    }





    
    // if(!socket.connected) {
    if(!isSocketReady) {
        return <p>Waiting for websocket ...</p>
    }



    return (
        <div>
            <h1>ChooseRole</h1>

            <div className='flex flex-col h-[500px] justify-center items-center'>
                <div className="bg-gradient-to-br flex flex-col items-center justify-center">
                    
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md m-4">
                        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Choisissez votre rôle</h1>
                        <p className="text-center text-gray-600 mb-8">
                            Sélectionnez le rôle que vous souhaitez jouer dans cette partie.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Button
                                variant='info'
                                onClick={() => handleChooseRole('presentator')}
                            >
                                Présentateur
                            </Button>

                            <Button
                                variant='info'
                                disabled={!user}
                                onClick={() => handleChooseRole('player')}
                            >
                                Joueur
                            </Button>
                        </div>
                    </div>

                {   !user && (<p className='italic text-sm pt-3'>Vous voulez être joueur, connectez vous !</p>)}
                </div>


            </div>
        </div>
    )
}
