import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession';
import { useNavigate } from 'react-router'
import WelcomeSection from '../components/Dashboard/WelcomeSection';
import { FaExclamationCircle } from 'react-icons/fa';
import ActionCards from '../components/Dashboard/ActionCards';
import FeaturesGrid from '../components/Dashboard/FeaturesGrid';
import SessionList from '../components/Dashboard/SessionList';

const Dashboard = () => {
  const { user } = useAuth();
  const { createSession, listSession, error, loading } = useSession();
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false)
  const [sessions, setSessions] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')

  const handleCreateSession = async () => {
    setCreating(true)
    const result = await createSession();
    if (result.success) {
      navigate(`/host?roomId=${result.session.roomId}`)
    }
    setCreating(false);
  }

  useEffect(() => {
    const load = async () => {
      const result = await listSession(statusFilter);
      if (result.success) {
        setSessions(result.session)
      }
    }

    load();
  }, [listSession, statusFilter])

  const handleRejoinSession = (session) => {
    if (session.status === 'active') {
      if (session.isHost) {
        navigate(`/host?roomId=${session.roomId}`)
      } else {
        navigate(`/join?roomId=${session.roomId}`)
      }
    }
  }

  const handleJoinSession = () => {
    navigate('/join')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>

        <WelcomeSection userName={user?.name} />

        {error && (
          <div className='max-w-2xl mx-auto mb-8'>
            <div className='bg-red-50 border-1 border-red-500 text-red-700 p-4 rounded-lg shadow-md'>

              <div className='flex items-center'>

              <FaExclamationCircle className='w-5 h-5 mr-2 ' />
              <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        <ActionCards 
          onCreateSession = {handleCreateSession}
          onJoinSession = {handleJoinSession}
          creating={creating}
        />


        <FeaturesGrid/>

        <SessionList
          sessions={sessions}
          loading={loading}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          onRejoinSession={handleRejoinSession}
        />
      </main>
    </div>
  )
}

export default Dashboard