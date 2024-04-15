import React, { createContext, useContext, useState } from 'react';
import cookie from 'react-cookies';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(cookie.load('userInfo')?.username);
    const [mode, setMode] = useState(cookie.load('userInfo')?.mode);
    const login = (username, mode) => {
        console.log("Save Login Cookie");
        cookie.save('userInfo', { username, mode }, { path: '/', maxAge: 3600 });
        setUsername(username);
        setMode(mode);
        console.log("loginhere" + username, mode)
    };
    const logout = () => {
        console.log("Remove Login Cookie");
        cookie.remove('userInfo');
        setUsername(undefined);
        setMode(undefined);
    };
    console.log({ username, mode });
    return (
        <AuthContext.Provider value={{ username, mode, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    return useContext(AuthContext);
}