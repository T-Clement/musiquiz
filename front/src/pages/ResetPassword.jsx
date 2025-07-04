import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/Button";
import apiAxios from "../libs/axios";
import RedirectAfterDelay from "../components/RedirectAfterDelay";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const location = useLocation(); // to get token from URL

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    if(password != confirmPassword) {
      setError('Les mots de passes ne correspondent pas.')
      return;
    }

    try {

      // send request
      const response = await apiAxios.post('/api/reset-password' ,{ token, password});

      if(response.status === 200) {

        setSuccess(true);

      }

    } catch (error) {
      console.error(error.response.data.message);
      setError(error.response.data.errors ? error.response.data.errors[0].msg : error.response.data.message);
    }


  };

  return (
    <div>
      <h2>Réinitiliaser votre mot de passe</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <input type="hidden" value={token} />
        <div>
          <label>
            Nouveau mot de passe :
          </label>
            <input
              className="text-black"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        </div>

        <div>
          <label>
            Confirmez le mot de passe :
          </label>
            <input
              className="text-black"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
        </div>

        <Button type="submit" variant="blue">Réinitiliaser</Button>

      </form>
      {error && <p className="text-red-500 italic">{error}</p>}
      {success && <RedirectAfterDelay pageToRedirect='/' />}

    </div>
  );
}
