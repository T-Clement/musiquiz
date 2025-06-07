// import { AuthContext } from '../../App';
import Logout from "./Logout";
import Button from "../Button";
import LinkWithViewTransition from "../LinkWithViewTransition";

export default function Nav({
  openModal,
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
}) {
  console.log("Render Nav");
  return (
    <nav className="block">
      {isLoggedIn ? (
        <ul className="flex gap-x-6">
          <li>
            <LinkWithViewTransition
              unstable_viewTransition
              to={`/user/${user.userId}`}
            >
              Compte
            </LinkWithViewTransition>
          </li>
          {/** use optionjal chaining to check is previous property exits before getting access to next property  */}
          <li>
            <Logout
              setIsLoggedIn={setIsLoggedIn}
              user={user}
              setUser={setUser}
            />
          </li>
        </ul>
      ) : (
        <div>
          <ul className="flex gap-x-6">
            <li>
              <Button
                onClick={() => openModal("login")}
                variant="blue"
                className=""
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width={"16px"}
                  fill="white"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                </svg>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
