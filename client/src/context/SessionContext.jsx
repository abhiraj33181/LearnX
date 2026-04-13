/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from "react";
import api from "../services/api";


const SessionContext = createContext();

export const SessionProvider = ({children}) => {
    const [currentSession, setCurrentSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Create a new session 
    const createSession = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await api.post("/session/create")
            const session = response.data.data.session;

            setCurrentSession(session)
            return {
                success : true,
                session
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to create new session';
            setError(errorMessage);
            return {
                success : false,
                error : error.message
            }
        } finally {
            setLoading(false)
        }
    }, [])


    // Join Session
    const joinSession = useCallback(async (roomId) => {
        try {
            setError(null);
            setLoading(true);
            const response = await api.post("/session/join", {roomId})
            const session = response.data.data.session;

            setCurrentSession(session)
            return {
                success : true,
                session
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to join session';
            setError(errorMessage);
            return {
                success : false,
                error : error.message
            }
        } finally {
            setLoading(false)
        }
    }, [])


    // get session 
    const getSession = useCallback(async (roomId) => {
        try {
            setError(null);
            setLoading(true);
            const response = await api.get("/session/" + roomId)
            const session = response.data.data.session;

            setCurrentSession(session)
            return {
                success : true,
                session
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to get session';
            setError(errorMessage);
            return {
                success : false,
                error : error.message
            }
        } finally {
            setLoading(false)
        }
    }, [])


      // Leave session 
    const leaveSession = useCallback(async (roomId) => {
        try {
            setError(null);
            setLoading(true);
            await api.post("/session/leave", { roomId })

            setCurrentSession(null)
            return {
                success : true
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to leave session';
            setError(errorMessage);
            return {
                success : false,
                error : error.message
            }
        } finally {
            setLoading(false)
        }
    }, [])


    // list session 
    const listSession = useCallback(async (status = 'all') => {
        try {
            setError(null);
            setLoading(true);
            const response = await api.get("/session/list", {params : {status}})
            const session = response.data.data.session;

            return {
                success : true,
                session
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch sessions';
            setError(errorMessage);
            return {
                success : false,
                error : error.message
            }
        } finally {
            setLoading(false)
        }
    }, [])

    const clearSession = useCallback(() => {
        setCurrentSession(null);
        setError(null);
    }, [])

    const value = {
        currentSession,
        loading,
        error,
        createSession,
        joinSession,
        getSession,
        leaveSession,
        listSession,
        clearSession,
        setError
    }

    return <SessionContext.Provider value={value}>
        {children}
    </SessionContext.Provider>

}


export const useSession = () => {
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error('useSession must be used within a session Proider')
    }

    return context;
}


export default SessionContext;