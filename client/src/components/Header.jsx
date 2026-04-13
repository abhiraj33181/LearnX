import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router';
import { FaVideo } from 'react-icons/fa';
import { APP_CONFIG } from '../utils/constants';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className='fixed top-0 left-0 right-0 bg-white z-50 shadow-sm border-b border-gray-200'>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-wrap justify-between items-center h-16'>

                    <Link to="/"
                        className='flex items-center space-x-3'
                    >

                        <div className='w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'>
                            <FaVideo className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='text-xl font-bold bg-linear-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                            LearnX
                        </h1>

                    </Link>


                    <nav className='flex items-center space-x-4'>
                        {isAuthenticated ? (
                            <>
                            <Link to={'/dashboard'} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
                            Dashboard
                            </Link>
                            <div className='flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg'>

                                <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center'>
                                    <span className='text-white text-sm font-semibold'>
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                    </span>
                                </div>

                                <span className='text-gray-700 font-medium text-sm hidden sm:inline'>{user?.name}</span>

                            </div>

                            <button className='px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm' onClick={logout}>
                                Logout
                            </button>
                            </>
                        ) : (
                            <>
                            <Link to={'/login'} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
                                Sign In
                            </Link>

                            <Link to={'/register'} className='px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors shadow-sm'>
                                Sign Up
                            </Link>
                            </>
                        )}
                    </nav>

                </div>
            </div>
        </header>
    )
}

export default Header