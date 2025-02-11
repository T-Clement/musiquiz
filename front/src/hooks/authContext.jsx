import { createContext, useCallback, useEffect, useState } from "react";
import apiAxios from "../libs/axios";
import { authService } from "../services/authService";




export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // const refreshUserData = useCallback(async () => {
    //     try {
    //       const userData = await authService.getUserData();
    //       console.log("Refresh accessToken")
    //       console.log(userData)
    //       setUser(userData);
    //     } catch (error) {
    //       console.error("Erreur lors de la mise à jour des données utilisateur", error);
    //       // gérer l'erreur (par exemple, déconnecter l'utilisateur)
    //     }
    //   }, []);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await apiAxios.get('/api/me');
                // console.log("checkUser");
                // console.log(response.data);
                // console.log(response.data.user);
                setUser(response.data.user);
            } catch (error) {

                if (error.response.status === 401) {
                    console.error('User Unauthorized'); // may be a presentator so it's normal
                } else if(error.response.status === 403) {
                    console.error('Forbidden');
                } else {
                    console.error('Error during checkUser : ', error);
                }

                setUser(null);
            } finally {
                setLoading(false);
            }
        
        }
        checkUser();
    }, []); // launch only once on load



    return (
        // <AuthContext.Provider value={{user, setUser, loading, refreshUserData}}>{children}</AuthContext.Provider>
        <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>
    )


}