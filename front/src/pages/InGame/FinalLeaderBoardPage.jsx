import React, { useState } from "react";
import TopPlayers from "./TopPlayers";
import RankedPlayers from "./RankedPlayers";
import { useLocation, useNavigate } from "react-router-dom";
import Tab from "../../components/Tab";
import RoundsSection from "./RoundsSection";

export default function LeaderboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);
  const { scores, roomName, tracks } = location.state;

  // console.log(scores);

  const [tabSelected, setTabSelected] = useState("Classement");

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h3 className="mb-8 text-3xl">{roomName}</h3>
      <div className="rounded-full mb-8 overflow-hidden">

        <Tab
          title="Classement"
          setActiveTab={() => setTabSelected("Classement")}
          isActive={tabSelected === "Classement"}
        />
        <Tab
          title="Rounds"
          setActiveTab={() => setTabSelected("Rounds")}
          isActive={tabSelected === "Rounds"}
        />

      </div>



      <div>
        {tabSelected === "Classement" && (
          <>
            <h3 className="mb-12 text-2xl">🏆 Classement 🏆</h3>
            <TopPlayers players={scores.slice(0, 3)} />
            <RankedPlayers players={scores.slice(3)} />
          </>
        )}
        {tabSelected === "Rounds" && 
          <>
            <RoundsSection rounds={ tracks } />
          </>
        }
      </div>
    </div>
  );
}
