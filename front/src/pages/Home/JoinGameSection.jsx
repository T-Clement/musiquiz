import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { checkIfRoomExists } from '../../rooms';
import Tab from '../../components/Tab';
import JoinRoomSearchInput from './JoinRoomSearchInput';
import JoinRoomQrCode from './JoinRoomQrCode';

function JoinGameSection() {

    const [tabSelected, setTabSelected] = useState("Code");
    const [roomCode, setRoomCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => setRoomCode(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const room = await checkIfRoomExists(roomCode);

        if (room) {
            navigate(`/waiting-room/${roomCode}`, { state: { room } });
        } else {
            setErrorMessage("Aucune salle n'a été trouvée avec cet identifiant");
        }
    }



    return (

        <div className='mt-3 flex flex-col justify-center items-center'>

            <div className='rounded-lg overflow-hidden'>
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