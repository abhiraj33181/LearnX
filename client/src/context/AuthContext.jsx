/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    // check if user is authenticated on mount 


    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/auth/me')
                setUser(res.data.data)
            } catch {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false)
            }
        }

        checkAuth();
    }, [])


    const register = async (name, email, password) => {
        try {
            setError(null)
            setLoading(true)
            const res = await api.post('/auth/register', {
                name,
                email,
                password
            })

            const { user, token } = res.data.data;

            localStorage.setItem('token', token);
            setUser(user)

            return {
                success: true,
                user
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Registration failed"
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            setError(null)
            setLoading(true)
            const res = await api.post('/auth/login', {
                email,
                password
            })

            const { user, token } = res.data.data;

            localStorage.setItem('token', token);
            setUser(user)

            return {
                success: true,
                user
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Login failed"
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null);
        setError(null);
    }

    const value = {
        user,
        loading,
        error,
        setError,
        isAuthenticated : !!user,
        register,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('UseAuth must be used within an AuthProvider')
    }

    return context;
}


export default AuthContext;