import axios from 'axios';
import { toast } from 'sonner';
// import { authService } from '../services/authService';

const apiAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// apiAxios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response.status === 403 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 await authService.refreshToken(); //api call to refresh token
//                 return apiAxios(originalRequest);
//             } catch (refreshError) {
//                 console.error("Erreur lors de la tentative de refresh token", refreshError);
//                 // handle disconnection
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

const SILENT_ROUTES = [
    { url: '/api/me', status: 401}, 
];

apiAxios.interceptors.response.use(
  res => res,
  error => {
    const {config, response} = error;
    if(config?.silent) return Promise.reject(error);

    const isSilent = SILENT_ROUTES.some(route =>
      config.url.includes(route.url) &&
      (!route.status || route.status === response?.status)
    );
    if (isSilent) return Promise.reject(error);

    
    toast.error(
      response?.data?.error || "Une erreur est survenue suite à votre action.",
      {
        description: response?.data?.message || "Merci de réessayer plus tard.",
        duration: 5000,
      }
    );
    console.error("API error:", error);

    return Promise.reject(error);

  }     
);

export default apiAxios;







