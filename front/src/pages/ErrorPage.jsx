import { useRouteError } from "react-router-dom";
import LinkWithViewTransition from '../components/LinkWithViewTransition';


export function ErrorPage() {

  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <p>Retour à la page <LinkWithViewTransition className='text-blue-500' to="/">Home</LinkWithViewTransition></p>
    </div>
  )
}