import React, { createContext, useContext, useState } from 'react';
import { setAuthToken } from '../utils/request';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(JSON.parse(localStorage.getItem('userInfo'))?.username);
    const [mode, setMode] = useState(JSON.parse(localStorage.getItem('userInfo'))?.mode);
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('userInfo'))?.token);
    const login = (username, mode, token) => {
        localStorage.setItem('userInfo', JSON.stringify({ username, mode, token }));
        setUsername(username);
        setMode(mode);
        setToken(token);
        // setAuthToken(token);
        console.log("loginhere" + username, mode, token);
        console.log(localStorage.getItem('userInfo'));  
    };
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUsername(undefined);
        setMode(undefined);
        setToken(undefined);
        // setAuthToken(undefined);
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