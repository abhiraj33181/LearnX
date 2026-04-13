import { useCallback, useEffect, useRef, useState } from "react"
import { useAuth } from "./useAuth";
import { joinRoom, leaveRoom } from "../services/zego";



export const useZego = () => {
    const [userHasJoined, setUserHasJoined] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    const containerRef = useRef(null);

    const joinRoomIdRef = useRef(null);

    const isJoiningRef = useRef(false);

    const isLeavingRef = useRef(false);

    const { user } = useAuth();


    const joinedZegoRoom = useCallback(async (roomId) => {
        if (joinRoomIdRef.current === roomId && isJoined) {
            return { success: true }
        }

        if (isJoiningRef.current) {
            return { success: false, error: 'Join room in progress' }
        }

        if (!roomId) {
            const errorMessage = 'Room Id is required'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        }

        isJoiningRef.current = true;
        setLoading(true);
        setError(null);

        try {
            // wait for container to be available 
            let retries = 0;
            const maxRetries = 30;

            while (!containerRef.current && retries < maxRetries) {
                await new Promise(resolve => setTimeout(() => resolve, 100))
                retries++;
            }

            if (!containerRef.current) {
                throw new Error('Video container not ready after waiting. Please refresh the page')
            }

            const container = containerRef.current;
            if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                console.warn("Container has 0 dimensions, waiting a bit more...");
                await new Promise(resolve => setTimeout(() => resolve, 500))
            }

            if (!user || !user._id) {
                const errorMessage = "User not ready";
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }

            await joinRoom(
                roomId,
                user._id,
                user.name,
                container,
                () => {
                    setUserHasJoined(true)
                },
                () => {
                    setUserHasJoined(false)
                }
            )

            setIsJoined(true)
            joinRoomIdRef.current = roomId
            return {
                success: true
            }
        } catch (error) {
            console.error('Failed to hoin the zego room', error);
            const errorMessage = error.message || 'Failed to join room. Please check your camera, microphone permission and try again'
            setError(errorMessage)
            setIsJoined(false);
            setUserHasJoined(false)
            joinRoomIdRef.current = null;

            return {
                success: false,
                error: errorMessage
            }

        } finally {
            setLoading(false);
            isJoiningRef.current = false;
        }
    }, [user, isJoined])

    const leaveZegoRoom = useCallback(async () => {
        if (isLeavingRef.current || !joinRoomIdRef.current) {
            return;
        }

        isLeavingRef.current = true;
        try {
            leaveRoom(() => {
                setUserHasJoined(false)
            })

            setIsJoined(false)
            setUserHasJoined(false)
            joinRoomIdRef.current = null;
        } catch (error) {
            console.error('Error leaving rego room', error);
            setIsJoined(false);
            setUserHasJoined(false)
            joinRoomIdRef.current = null;
        } finally {
            isLeavingRef.current = false;
        }
    }, [])


    useEffect(() => {
        return () => {
            if (joinRoomIdRef.current && !isLeavingRef.current) {
                try {
                    leaveRoom();
                } catch (error) {
                    console.error("Error in cleanup leave room", error);
                }

                joinRoomIdRef.current = null;
                isJoiningRef.current = false;
                isLeavingRef.current = false;
            }
        }
    }, [])



    return {
        isJoined,
        userHasJoined,
        error,
        loading,
        containerRef,


        joinedZegoRoom,
        leaveZegoRoom
    }
}