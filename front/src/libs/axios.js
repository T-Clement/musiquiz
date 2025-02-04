import axios from 'axios';
import { authService } from '../services/authService';

const apiAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

apiAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await authService.refreshToken();
                return apiAxios(originalRequest);
            } catch (refreshError) {
                console.error("Erreur lors de la tentative de refresh token", refreshError);
                // gérer la déconnexion ou la redirection ici
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiAxios;