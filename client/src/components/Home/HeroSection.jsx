import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { FaArrowRight, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router';
import { APP_CONFIG } from '../../utils/constants';

const HeroSection = () => {
    const { isAuthenticated } = useAuth();
    return (
        <section className='relative p-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden'>

            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blue-xl opacity-20 animate-blob'></div>

                <div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blue-xl opacity-20 animate-blob animation-delay-2000'></div>

                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo 300 mix-blend-multiply filterblur-xl opacity-20 animate-blob animation-delay-4000'></div>
            </div>

            <div className='relative max-w-7xl mx-auto'>
                <div className='text-center'>
                    <div className='inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-8'>
                        <FaRocket className='w-4 h-4 mr-2' />
                        Start Your First Live Session Today
                    </div>

                    <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6'>
                        Connect, Learn
                        <span className='block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                            Grow Together
                        </span>
                    </h1>

                    <p className='text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto'>
                        Host and join live interactive sessions with HD video, real-time chat, and seamless collaboration. Perfect for education, meetings, and more.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                        {isAuthenticated ? (
                            <Link to={'/dashboard'} className='px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg transition-all transform hover:scale-105 flex items-center'>
                                Go to Dashboard
                                <FaArrowRight className='ml-2'/>
                            </Link>
                        ) : (
                            <>
                            <Link to={'/register'} className='px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg transition-all transform hover:scale-105 flex items-center'>
                                Get Started Free
                                <FaArrowRight className='ml-2'/>
                            </Link>


                            <Link to={'/login'} className='px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg transition-all'>
                                Sign In
                            </Link>
                            </>
                        )}
                    </div>


                    {/* Trust Indicator  */}
                    <div className='mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-600'>
                        {APP_CONFIG.TRUST_INDICATORS.map((indicator, index) => (
                            <div key={index} className='flex items-center'>
                                <FaCheckCircle className='w-5 h-5 text-green-500 mr-2'/>
                                <span>{indicator}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>


        </section>
    )
}

export default HeroSection