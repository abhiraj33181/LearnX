import { FaCircle, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa'
import { formatDate } from '../../utils/helpers'

const SessionList = ({ sessions, loading, statusFilter, onFilterChange, onRejoinSession }) => {

  const statusBadge = (status) => {
    const map = {
      active: 'bg-green-100 text-green-700',
      ended: 'bg-gray-100 text-gray-700',
    }

    return map[status] || 'bg-gray-100 text-gray-700'
  }
  return (
    <div className='mt-16 max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3'>
        <div>
          <h3 className='text-2xl text-gray-900 font-bold'>
            Your Sessions
          </h3>
          <p className='text-gray-600'>
            Active and past sessions you hosted or joined
          </p>
        </div>


        <div className='flex items-center space-x-3'>
          <label htmlFor="" className='text-sm text-gray-600'>Filter:</label>
          <select value={statusFilter} onChange={(e) => onFilterChange(e.target.value)} className='py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>


      {loading && sessions.length === 0 ? (
        <div className='flex items-center text-gray-600'>
          <FaSpinner className='animate-spin h-5 w-5 mr-2' />
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className='text-gray-600'>
          No sessions yet.
        </div>
      ) : (
        <div className='space-y-4'>
          {sessions.map(s => (
            <div key={s.id} className='border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between gap-3 hover:shadow-md transition-shadow'>

              <div>
                <div className='flex items-center space-x-3'>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(s.status)}`}>
                    <FaCircle className='w-2 h-2 mr-2' />
                    {s.status}
                  </span>

                  {s.isHost && (
                    <span className='text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>
                      Host
                    </span>
                  )}
                </div>

                <div className='mt-2 text-lg font-semibold text-gray-900'>
                  Room : {s.roomId}
                </div>

                <div className='text-gray-500 mt-1 text-sm'>
                  Host : {s.hostName}
                </div>

                <div className='text-gray-500 text-sm'>
                  Participants : {s.participantCount}
                </div>

                <div className='text-sm text-gray-500 mt-1'>
                  Started : {s.startedAt ? formatDate(s.startedAt) : "N/A"}
                  {s.endedAt && <>. Ended: {formatDate(s.endedAt)}</>}
                </div>

              </div>

              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => onRejoinSession(s)}
                  disabled={s.status !== 'active'}
                  className='inline-flex items-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {s.status === 'active' ? (
                    <span className='flex items-center justify-center gap-2'>
                      Rejoin
                      <FaExternalLinkAlt className='w-4 h-4' />
                    </span>
                  ) : "Ended"}
                </button>
              </div>


            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default SessionList