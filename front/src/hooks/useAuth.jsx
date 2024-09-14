import { useState, useEffect } from 'react';

export function useAuth() {
    // const [user, setUser] = useState(null);
    // const [token, setToken] = useState(null);

    // useEffect(() => {
    //     // check if token is in localstorage
    //     const savedToken = localStorage.getItem('token');
    //     if (savedToken) {
    //         setToken(savedToken);
    //         fetchUserProfile(savedToken);
    //     }
    // }, []);

    const fetchUserProfile = async (token) => {
        // try {
        //     const response = await fetch('/api/user/profile', {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //         },
        //     });
        //     if (response.ok) {
        //         const userData = await response.json();
        //         setUser(userData);
        //     } else {
        //         logout();
        //     }
        // } catch (error) {
        //     console.error('Error fetching user profile:', error);
        //     logout();
        // }
    };

    const login = async (email, password) => {
        try {
            console.log("in try bloc")
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            console.log(response);
            console.log("after response")
            if (response.ok) {
                console.log("in resonse ok");
                const data = await response.json();
                console.log(data);
                localStorage.setItem('token', data.token); // save token in localstorage
                // setToken(data.token); 
                // await fetchU²serProfile(data.token);
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        // localStorage.removeItem('token'); // delete token
        // setToken(null);
        // setUser(null);
    };

    const isAuthenticated = !!user;

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
    };
}
