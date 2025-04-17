import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RedirectAfterDelay({pageToRedirect, delay = 3000}) {
  
  const navigate = useNavigate();

  useEffect(() => {

    // setTimeOut to redirect after delay
    const timer = setTimeout(() => {
      navigate(`${pageToRedirect}`);  
    }, delay);

    // cleanup timer if component is unmount before redirection
    return () => clearTimeout(timer);
  }, [navigate, delay]);
  
    return (
    <div>
        <h2>Redirection dans {delay / 1000} secondes...</h2>
    </div>
  )
}
