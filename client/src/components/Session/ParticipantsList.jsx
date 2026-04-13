import React from 'react'
import { FaUsers } from 'react-icons/fa'

const ParticipantsList = ({ participants, hostName }) => {
  if (!participants || participants.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-4'>
        <div className='flex items-center mb-4'>
          <FaUsers className='w-5 h-5 mr-2 text-indigo-600' />
          <h2 className='text-xl font-bold text-gray-900'>
            Participants
          </h2>
        </div>

        <div className='text-center py-4'>
          <p className='text-sm text-gray-500'>
            Participants will appear here as they join
          </p>
        </div>

      </div>
    )
  }

  const hostParticipants = participants.filter((p) => p.userName === hostName)
  const otherParticipants = participants.filter((p) => p.userName !== hostName)

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-4'>

      <div className='flex items-center mb-4'>
        <FaUsers className='w-5 h-5 mr-2 text-indigo-600' />
        <h2 className='text-xl font-bold text-gray-900'>
          Participants ({participants.length})
        </h2>
      </div>


      <div className='space-y-3'>
        {hostParticipants.map((p) => (
          <div className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100'>
            <div className='flex items-center gap-3'>
              <div className='text-white w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center'>
                <span>
                  {p.userName?.charAt(0)?.toUpperCase()}
                </span>
              </div>

              <div>
                <p className='font-semibold text-gray-900 truncate max-w-[150px]'>{p.userName}</p>

                <p className='text-xs text-blue-600 font-medium'>
                  Host
                </p>

              </div>

            </div>

          </div>
        ))}


        {otherParticipants.length > 0 && (
          <>
            <div className='p-1 border-t- border-gray-200 text-gray-sm text-gray-500'>
              Joined Users

              {otherParticipants.map((p) => (
                <div className='p-3 bg-white rounded-lg border border-gray-200 flex items-center'>
                  <div className='mr-3 text-gray-700 font-semibold w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center'>
                    {p.userName?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p className='font-semibold text-gray-900 truncate max-w-[150px]'>{p.userName}</p>

                    <p className='text-xs text-gray-500'>
                      Participant
                    </p>

                  </div>

                </div>

              ))}

            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default ParticipantsList