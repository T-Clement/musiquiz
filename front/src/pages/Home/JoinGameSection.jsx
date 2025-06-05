import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Tab from '../../components/Tab';
import JoinRoomSearchInput from './JoinRoomSearchInput';
import JoinRoomQrCode from './JoinRoomQrCode';
import { AuthContext } from '../../hooks/authContext';
import apiAxios from '../../libs/axios';

function JoinGameSection() {

    const { user } = useContext(AuthContext);

    const [tabSelected, setTabSelected] = useState("Code");
    const [roomCode, setRoomCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => setRoomCode(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // reset errorMessage
        setErrorMessage("");

        // check to specific API route if game exists in noSQL database
        try {
            // send role to server
            const response = await apiAxios.post(`${import.meta.env.VITE_API_URL}/api/game/check-sharing-code`, {
                sharingCode: roomCode
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });


            // console.log(response.data);

            // console.log(response);
            // if response is ok, redirect to waiting room
            if (response.data) {
                navigate(`/game/${response.data.game._id}/choose-role?source=sharingCode&sharingCode=${response.data.sharingCode}`, { state: { game: response.data, user: user } });
            } else {
                // setErrorMessage("Aucune salle n'a été trouvée avec cet identifiant");
            }

        } catch (error) {
            // is catched as an Error 
            console.error('Error in ChooseRole page', error);
            // navigate('/');
            setErrorMessage("Aucune salle n'a été trouvée avec cet identifiant");
        }

    }



    return (

        <div className='mt-3 flex flex-col justify-center items-center'>

            <div className='rounded-full overflow-hidden'>
                <Tab title="Code" setActiveTab={() => setTabSelected("Code")} isActive={tabSelected === "Code"} />
                <Tab title="QrCode" setActiveTab={() => setTabSelected("QrCode")} isActive={tabSelected === "QrCode"} />
            </div>

            <div className='mt-3'>
                {tabSelected === "Code" &&
                    <JoinRoomSearchInput
                        errorMessage={errorMessage}
                        onChangeInput={handleChange}
                        roomCode={roomCode}
                        onSubmitForm={handleSubmit}
                    />}
                {tabSelected === "QrCode" && <JoinRoomQrCode />}
            </div>

        </div>
    )
}

export default JoinGameSection