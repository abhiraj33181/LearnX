import React from 'react'

const WelcomeSection = ({userName}) => {
  return (
    <div className='text-center mb-12'>
      <h2 className='text-4xl font-bold text-gray-900 mb-3'>
        Welcome back, {userName}! 👋
      </h2>

      <p className='text-lg text-gray-600'>
        Start or join a live session to connect with others
      </p>
      
    </div>
  )
}

export default WelcomeSection