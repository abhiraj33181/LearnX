import React from 'react'
import { FaExclamationCircle, FaExpand, FaSpinner, FaVideo } from 'react-icons/fa'

const VideoContainer = ({ containerRef, isJoined, userHasJoined, zegoError, zegoLoading, onFullScreen, onLeave, leaveButtonText }) => {
  return (
    <div className='bg-white rounded-xl shadow-lg border p-6 border-gray-100'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-gray-900 flex items-center'>
          <FaVideo className='w-5 h-5 mr-2 text-blue-600' />
          Live Video Session
        </h2>

        <div className='flex items-center space-x-3'>
          {isJoined && (
            <span className='flex items-center text-sm text-green-600 font-medium'>
              <span className='w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse'>
              </span>
              Connected
            </span>
          )}

          <button
            onClick={onFullScreen}
            className='px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <FaExpand className='inline-block mr-1' />
            Fullscreen
          </button>
        </div>
      </div>

      {zegoError && (
        <div className='mb-4 bg-red-50 border-1-4 border-red-500 text-red-700 p-4 rounded-lg'>
          <div className='flex items-center'>
            <FaExclamationCircle className='w-5 h-5 mr-2' />

            <span className='text-sm'>
              {zegoError}
            </span>
          </div>
        </div>
      )}

      <div className='relative w-full h-[calc(100vh-180px)] rounded-xl overflow-hidden bg-gray-900 border-2 border-gray-200 shadow-inner'>
        <div className='w-full h-full' ref={containerRef} />

        {zegoLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-900/60 pointer-events-none'>
            <div className='inline-flex items-center text-white'>
              <FaSpinner className='animate-spin h-5 w-5 mr-2' />
              Connecting to video room...
            </div>
          </div>
        )}



      </div>
        {onLeave && !userHasJoined && (
          <div className='mt-6 flex justify-center'>
            <button
              className='px-8 py-3 font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-all transform hover:scale-105'
              onClick={onLeave}
            >
              {leaveButtonText || "Leave Session"}
            </button>

          </div>
        )}
    </div>
  )
}

export default VideoContainer