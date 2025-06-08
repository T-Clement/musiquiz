import apiAxios from '../../libs/axios'
import { useLoaderData } from 'react-router-dom';
import { UserSummaryCard } from './UserSummaryCard';
import { LastGamesTimeline } from './LastGamesTimeline';

export async function loader({ params }) {
    const userData = await apiAxios(
        `${import.meta.env.VITE_API_URL}/api/user/${params.id}`
    ).then((response) => response.data);
    return { userData };
}


export default function AccountPage() {

    const { userData } = useLoaderData();
    // console.log(userData);

  // TODO : update password
  // TODO : total games, total of games this week / month
  // TODO : bestscore scored, average score


  return (

    <main className="max-w-screen-xl mx-auto px-4 lg:px-6 space-y-12">

      <UserSummaryCard user={userData.user} games={userData.games} />

      <LastGamesTimeline games={userData.games} />

    </main>


  )
}
