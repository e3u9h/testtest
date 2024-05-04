import React, { createContext, useContext, useState } from 'react';
// I admit that I used GPT-4 in poe (https://poe.com/) to draft the fisrt version of this part,
// and modified it manually to make it useable in our project.

// This is the context provider which is used to manage the user's login status
// It provides the user information (username, mode and token)
// and login/logout functions to all the components that need these information or functions
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(JSON.parse(localStorage.getItem('userInfo'))?.username);
    const [mode, setMode] = useState(JSON.parse(localStorage.getItem('userInfo'))?.mode);
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('userInfo'))?.token);
    const login = (username, mode, token) => {
        // save the user information to localStorage
        localStorage.setItem('userInfo', JSON.stringify({ username, mode, token }));
        // update the context states
        setUsername(username);
        setMode(mode);
        setToken(token);
        console.log("loginhere" + username, mode, token);
        console.log(localStorage.getItem('userInfo'));  
    };
    const logout = () => {
        // remove the user information from localStorage
        localStorage.removeItem('userInfo');
        // update the context states
        setUsername(undefined);
        setMode(undefined);
        setToken(undefined);
    };
    console.log({ username, mode, token });
    return (
        <AuthContext.Provider value={{ username, mode, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    return useContext(AuthContext);
}