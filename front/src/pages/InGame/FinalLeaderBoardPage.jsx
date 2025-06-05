import { useState } from "react";
import TopPlayers from "./TopPlayers";
import RankedPlayers from "./RankedPlayers";
import { useLocation } from "react-router-dom";
import Tab from "../../components/Tab";
import RoundsSection from "./RoundsSection";
import { VARIANT_STYLES } from "../../components/Button";
import LinkWithViewTransition from "../../components/LinkWithViewTransition";

export default function LeaderboardPage() {
  const location = useLocation();
  // const navigate = useNavigate();

  // const { setShowDeleteButton } = useOutletContext();

  console.log(location.state);
  const { scores, roomName, tracks } = location.state;

  // const userId;
  // console.log(scores);

  const [tabSelected, setTabSelected] = useState("Classement");

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h3 className="mb-8 text-3xl">{roomName}</h3>

      <div className="flex mb-6">
        <LinkWithViewTransition className={VARIANT_STYLES.blue} to="/">Accueil</LinkWithViewTransition>
        {/* <Link className={VARIANT_STYLES.outline} to="/user">Compte</Link> */}
      </div>


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
