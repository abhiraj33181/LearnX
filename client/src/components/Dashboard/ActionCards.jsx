import React from 'react'
import { FaPlus, FaSpinner, FaUser } from 'react-icons/fa'

const ActionCards = ({ onCreateSession, onJoinSession, creating }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
      <div className='bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:translate-y-1 border border-gray-100'>
        <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-6 mx-auto'>

          <FaPlus className='w-8 h-8 text-white' />

        </div>

        <h3 className='text-2xl font-bold text-gray-900 mb-3 text-center'>
          Host a Session
        </h3>
        <p className='text-gray-600 mb-6 text-center'>
          Create a new live session and invite participants to join your class
        </p>

        <button
          onClick={onCreateSession}
          disabled={creating}
          className='w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {creating ? (
            <span className='flex items-center justify-center'>
              <FaSpinner className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' />
              Creating...
            </span>
          ) : "Create Session"}
        </button>

      </div>


      {/* join session  */}
      <div className='bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:translate-y-1 border border-gray-100'>
        <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-6 mx-auto'>

          <FaUser className='w-8 h-8 text-white' />

        </div>

        <h3 className='text-2xl font-bold text-gray-900 mb-3 text-center'>
          Join a Session
        </h3>
        <p className='text-gray-600 mb-6 text-center'>
          Enter a room ID to join an existing live session
        </p>

        <button
          onClick={onJoinSession}
          className='w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Join Session
        </button>

      </div>

    </div>
  )
}

export default ActionCards