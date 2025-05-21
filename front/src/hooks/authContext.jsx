import { createContext, useEffect, useState } from "react";
import apiAxios from "../libs/axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await apiAxios.get('/api/me');

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
        <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>
    )


}