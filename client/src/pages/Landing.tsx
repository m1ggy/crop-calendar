import { Stack } from "@mui/joy";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import GenerateSection from "../components/GenerateSection";
import Header from "../components/Header";
import Hero from "../components/Hero";
import WhatSection from "../components/WhatSection";

function Landing() {
  return (
    <Stack>
      <Header />
      <Stack sx={{ 
        backgroundImage: 'url("/hero.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '100vh',
        mt: '-5rem'
      }}>

      <Hero />
      </Stack>
      <WhatSection />
      <FeaturesSection />
      <GenerateSection />
      <Footer />
    </Stack>
  );
}

export default Landing;
