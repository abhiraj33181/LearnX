import React from 'react'
import HeroSection from '../components/Home/HeroSection'
import FeatureSection from '../components/Home/FeatureSection'
import CTASection from '../components/Home/CTASection'
import BenifitsSection from '../components/Home/BenifitsSection'

const Home = () => {
  return (
    <div className='min-h-screen bg-white'>
      <HeroSection/>
      <FeatureSection/>
      <BenifitsSection/>
      <CTASection/>
    </div>
  )
}

export default Home