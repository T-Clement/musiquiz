import axios from 'axios';
import React from 'react';
import { AuthContext } from '../hooks/authContext';

const apiAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

apiAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;


        // if token is expired (403 Forbidden) and if not a refresh token request
        if(error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log("renew of accessToken")
            // call to '/refresh-token' to get a new accessToken
            try {
                const refreshResponse = await apiAxios.get('/api/refresh-token');

                console.log(refreshResponse);


                const newResponse = await apiAxios(originalRequest);

                const userResponse = await apiAxios.get('/api/me');


                const {setUser} = React.useContext(AuthContext);
                setUser(userResponse.data);

                return newResponse;

                // return apiAxios(originalRequest);
            } catch (error) {
                console.error("Erreur lors de la tentative de refresh token", error);

                // redirect to home page with a disconncted state and a information message on modal
                // 'You have been disconnected due to an error, sorry for that'
                
                
                
                // return Promise.reject(refreshError);
                return Promise.reject(error);
            }
            
        }
        return Promise.reject(error); // if not 403 error status
    }

);

export default apiAxios;