import React from 'react'
import { Link, useRouteError } from "react-router-dom";


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
      <p>Retour à la page <Link className='text-blue-500' to="/">Home</Link></p>
    </div>
  )
}