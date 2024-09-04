import { createContext, useState } from 'react'
import { authService } from '../authComponents/authServices';


export const AuthContext = createContext();


// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const login = (userData, token) => {
        setIsAuthenticated(true);
        setUser(userData);
        sessionStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };



    return (
        <AuthContext.Provider value={{isAuthenticated, user, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
