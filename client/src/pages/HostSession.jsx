import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router';
import { useZego } from '../hooks/useZego';
import { copyToClipboard } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import SessionHeader from '../components/Session/SessionHeader';
import SessionInfoCard from '../components/Session/SessionInfoCard';
import VideoContainer from '../components/Session/VideoContainer';
import ParticipantsList from '../components/Session/ParticipantsList';
import { useSession } from '../hooks/useSession';

const HostSession = () => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false)

  const {currentSession, getSession, clearSession} = useSession();
  const { user } = useAuth()
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const zegoJoinedRef = useRef(false)


  const roomId = searchParams.get('roomId') || currentSession?.roomId;

  const { isJoined, userHasJoined, error: zegoError, loading: zegoLoading, containerRef, joinedZegoRoom, leaveZegoRoom } = useZego();

  const handleFullScreen = () => {
    const videoContainer = containerRef.current;

    if (!videoContainer) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      videoContainer.requestFullscreen?.().catch(() => { })
    }
  }


  // session infomation loading 
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      if (!roomId) {
        navigate('/dashboard')
        return;
      }

      setLoading(true)
      const result = await getSession(roomId)

      if (!isMounted) return;

      if (result.success) {
        setSessionInfo(result.session)
      } else {
        navigate('/dashboard')
      }

      setLoading(false)
    };

    loadSession();

    return () => {
      isMounted = false
    }
  }, [roomId, getSession, navigate])

  // join zego room after container is mounted and session is loaded 

  useEffect(() => {
    if (!sessionInfo || !roomId || zegoJoinedRef.current) {
      return;
    }

    let isMounted = true;
    let retryTimeout = null;

    // wait for container to be ready 
    const joinZego = async () => {
      if (containerRef.current && isMounted && !zegoJoinedRef.current) {
        zegoJoinedRef.current = true;
        const zegoResult = await joinedZegoRoom(roomId);

        if (!isMounted) return;
        if (!zegoResult.success) {
          console.error(('Failed to join zego room', zegoResult.error));
          zegoJoinedRef.current = false;

        }
      } else if (isMounted && !zegoJoinedRef.current) {
        retryTimeout = setTimeout(joinZego, 200)
      }
    }

    joinZego()

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }

      if (zegoJoinedRef.current) {
        leaveZegoRoom();
        zegoJoinedRef.current = false;
      }
    }

  }, [sessionInfo, roomId, containerRef, joinedZegoRoom, leaveZegoRoom])


  // poll participant to keep list updated
  useEffect(() => {
    if (!roomId) return;
    const interval = setInterval(async () => {
      const res = await getSession(roomId);
      if (res.success && res.session) {
        setSessionInfo(prev => {
          if (prev && prev.participantCount === res.session.participantCount && prev.status === res.session.status && prev.participants?.length === res.session.participants?.length) {
            return prev
          }
          
          
          return res.session;
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [roomId, getSession])

  const handleCopyRoomId = async () => {
    if (roomId) {
      const success = await copyToClipboard(roomId)
      if (success) {
        setCopied(true);
        setTimeout(() => {
          setCopied(false)
        }, 2000);
      }
    }
  }

  const getSharableLink = () => {
    const baseURL = window.location.origin;
    return `${baseURL}/join/?roomId=${roomId}`
  }

  const handleCopyLink = async () => {
    const link = getSharableLink();
    const success = await copyToClipboard(link)
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false)
      }, 2000);
    }
  }


  // handle end session 

  const handleEndSession = async () => {
    if (!sessionInfo || !sessionInfo.isHost) return;

    try {
      if (zegoJoinedRef.current) {
        await leaveZegoRoom();
        zegoJoinedRef.current = false;
      }

      await api.post('/session/end/' + sessionInfo.id)
      clearSession();
      toast.success('Session ended successfully')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to end session. Please try again')
    }
  }


  const handleLeave = async () => {
    if (sessionInfo?.isHost) {
      handleEndSession();
    } else {
      if (zegoJoinedRef.current) {
        await leaveZegoRoom();
        zegoJoinedRef.current = false;
      }


      await api.post('/session/leave', { roomId })
      clearSession();
      navigate('/dashboard')
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className='mt-4 text-gray-600'>Loading session...</p>
        </div>
      </div>
    )
  }

  if (!sessionInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SessionHeader
        title="Hosting Session"
        roomId={roomId}
        userName={user?.name}
        onBack={handleBack}
        showEndButton={sessionInfo.isHost}
        onEndSession={handleEndSession}
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>


            <SessionInfoCard
              roomId={roomId}
              shareableLink={getSharableLink()}
              status={sessionInfo.status}
              participantCount={sessionInfo.participantCount}
              copied={copied}
              onCopyRoomId={handleCopyRoomId}
              onCopyLink={handleCopyLink}
            />

            <VideoContainer
              containerRef={containerRef}
              isJoined={isJoined}
              userHasJoined={userHasJoined}
              zegoError={zegoError}
              zegoLoading={zegoLoading}
              onFullScreen={handleFullScreen}
              onLeave={handleLeave}
              leaveButtonText={sessionInfo.isHost ? "End Session" : "Leave Session"}
            />
          </div>

          <div className='lg:col-span-1'>
            <ParticipantsList
              participants={sessionInfo.participants}
              hostName={sessionInfo.hostName}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default HostSession