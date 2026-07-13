import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        
        if (token) {
            setUser({ token, email, name });
            console.log('✅ User restored from localStorage:', email);
        } else {
            console.log('❌ No token found');
        }
        setLoading(false);
    }, []);

    const login = (token, email, name) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        setUser({ token, email, name });
        console.log('✅ User logged in:', email);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        setUser(null);
        console.log('✅ User logged out');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};