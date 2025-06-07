import { createBrowserRouter } from "react-router-dom";

import GameLayout from "./layouts/GameLayout";
import ChooseRole, { loader as chooseRoleLoader } from "./pages/ChooseRole";
import WaitingRoomPage, {
  loader as waitingRoomLoader,
} from "./pages/WaitingRoom/WaitingRoomPage";
import InGamePlayerPage from "./pages/InGame/InGamePlayerPage";
import InGamePresentatorPage from "./pages/InGame/InGamePresentatorPage";
import NewRoomPage from "./pages/NewRoom/NewRoomPage";
import FinalLeaderBoardPage from "./pages/InGame/FinalLeaderBoardPage";
import AccountPage, { loader as accountPageLoader } from "./pages/Account/AccountPage";
import ResetPassword from "./pages/ResetPassword";
import BrowseRoomsPage from "./pages/BrowseRoomsPage";
import JoinRoomQrCodePage from "./pages/JoinRoomQrCodePage";
import { ErrorPage } from "./pages/ErrorPage";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { HomePage, loader as homeLoader } from "./pages/Home/HomePage";
import { RoomPage, loader as roomPageLoader } from "./pages/Room/RoomPage";
import { Page404 } from "./pages/Page404";
import { ThemePage, loader as themePageLoader } from "./pages/Theme/ThemePage";
import { action as logoutAction } from "./components/Header/Logout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage />, loader: homeLoader },
      { path: "room/:id", element: <RoomPage />, loader: roomPageLoader },
      { path: "room/new", element: <NewRoomPage /> },
      { path: "room/browse", element: <BrowseRoomsPage /> },
      { path: "qr-code-join-room", element: <JoinRoomQrCodePage /> },
      { path: "user/:id", element: <AccountPage />, loader: accountPageLoader },
      { path: "theme/:id", element: <ThemePage />, loader: themePageLoader },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "*", element: <Page404 /> },
      { path: "user/logout", action: logoutAction },
    ],
  },
  {
    path: "/game/",
    element: <GameLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ":id/choose-role",
        element: <ChooseRole />,
        loader: chooseRoleLoader,
      },
      {
        path: ":id/waiting-room",
        element: <WaitingRoomPage />,
        loader: waitingRoomLoader,
      },
      { path: ":id/play/player", element: <InGamePlayerPage /> },
      { path: ":id/play/presentator", element: <InGamePresentatorPage /> },
      { path: ":id/leaderboard", element: <FinalLeaderBoardPage /> },
    ],
  },
]);
