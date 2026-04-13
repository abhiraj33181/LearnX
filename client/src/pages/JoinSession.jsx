import React, { useEffect, useRef, useState } from 'react'
import { useSession } from '../hooks/useSession'
import { useNavigate, useSearchParams } from 'react-router'
import { useZego } from '../hooks/useZego'
import api from '../services/api'
import SessionHeader from '../components/Session/SessionHeader'
import JoinForm from '../components/Session/JoinForm'
import VideoContainer from '../components/Session/VideoContainer'
import ParticipantsList from '../components/Session/ParticipantsList'

const JoinSession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState(() => searchParams.get('roomId') || '')
  const [localError, setLocalError] = useState('')
  const [sessionJoined, setSessionJoined] = useState(null)
  const [sessionInfo, setSessionInfo] = useState(null);

  const zegoJoinedRef = useRef(false);

  const { joinSession, getSession, loading, error } = useSession();
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

  // handle input change 
  const handleChange = (e) => {
    setRoomId(e.target.value.trim())
    setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('')

    if (!roomId) {
      setLocalError('Please enter a room ID')
      return;
    }

    const result = await joinSession((roomId))
    if (result.success) {
      setSessionInfo(result.session)
      setSessionJoined(true)

      if (result.session?.isHost) {
        navigate('/host/?roomId=' + roomId)
      }
    }
  }

  useEffect(() => {
    if (!sessionJoined || !roomId || zegoJoinedRef.current) {
      return;
    }

    let isMounted = true;
    let retryTimeout = null;

    const joinZego = async () => {
      if (containerRef.current && isMounted && !zegoJoinedRef.current) {
        zegoJoinedRef.current = true;
        const zegoResult = await joinedZegoRoom(roomId);

        if (!zegoResult.success) {
          console.error(('Failed to join zego room', zegoResult.error));
          zegoJoinedRef.current = false;

        }

      } else {
        retryTimeout = setTimeout(joinZego, 200);
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
  }, [sessionJoined, roomId, containerRef, joinedZegoRoom, leaveZegoRoom])

  useEffect(() => {
    if (!sessionJoined || !roomId) return;
    const interval = setInterval(async () => {
      const result = await getSession(roomId)
      if (result.success && result.session) {
        setSessionInfo(result.session)
      }
    }, 5000);

    return () => clearInterval(interval)
  }, [sessionJoined, roomId, getSession])

  const handleLeave = async () => {
    if (zegoJoinedRef.current) {
      await leaveZegoRoom()
      zegoJoinedRef.current = false
    }

    if (sessionJoined) {
      await api.post('/session/leave', { roomId })
    }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <SessionHeader
        title="Join Session"
        roomId={sessionJoined ? roomId : ""}
        onBack={() => navigate('/dashboard')}
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {!sessionJoined ? (
          <JoinForm
            roomId={roomId}
            error={error || localError}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        ) : (
          <>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2 space-y-6'>

                <VideoContainer
                  containerRef={containerRef}
                  isJoined={isJoined}
                  userHasJoined={userHasJoined}
                  zegoError={zegoError}
                  zegoLoading={zegoLoading}
                  onFullScreen={handleFullScreen}
                  onLeave={handleLeave}
                  leaveButtonText={"Leave Session"}
                />
              </div>

              <div className='lg:col-span-1'>
                <ParticipantsList
                  participants={sessionInfo.participants}
                  hostName={sessionInfo.hostName}
                />
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  )
}

export default JoinSession