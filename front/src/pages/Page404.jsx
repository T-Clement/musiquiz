import { Link } from "react-router-dom";

export function Page404() {
  return (
    <div>
      <p>404</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Retour à l'accueil  
      </Link>
    </div>
  )
}
