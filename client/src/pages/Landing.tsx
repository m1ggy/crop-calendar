import { Stack } from "@mui/joy";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import GenerateSection from "../components/GenerateSection";
import Header from "../components/Header";
import Hero from "../components/Hero";
import StickyNav from "../components/StickyNav";
import WhatSection from "../components/WhatSection";

function Landing() {
  return (
    <Stack>
      <Header />
      <Hero />
      <StickyNav />
      <WhatSection />
      <FeaturesSection />
      <GenerateSection />
      <Footer />
    </Stack>
  );
}

export default Landing;
