import { Stack } from '@mui/joy'
import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FeaturesSection from '../components/FeaturesSection'
import Footer from '../components/Footer'
import GenerateSection from '../components/GenerateSection'
import Header from '../components/Header'
import Hero from '../components/Hero'
import WhatSection from '../components/WhatSection'

function Landing() {
  const location = useLocation()
  const scrollIntoView = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (location.hash.includes('#')) {
      const id = location.hash.split('#')[1]

      scrollIntoView(id)
    }
  }, [location, scrollIntoView])
  return (
    <Stack>
      <Header />
      <Stack
        sx={{
          backgroundImage: 'url("/hero.jpg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          height: '100vh',
          mt: '-5rem',
        }}
      >
        <Hero />
      </Stack>
      <WhatSection />
      <FeaturesSection />
      <GenerateSection />
      <Footer />
    </Stack>
  )
}

export default Landing
