import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Founder from "./components/Founder";
import Services from "./components/Services";
import Technology from "./components/Technology";
import Projects from "./components/Projects";
import WhyChooseUs from "./components/WhyChooseUs";
import Reviews from "./components/Reviews";
import GlobalPresence from "./components/GlobalPresence";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <div className="noise-overlay" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Navbar />
        <main>
          <Hero />
          <About />
          <Founder />
          <Services />
          <Technology />
          <Projects />
          <WhyChooseUs />
          <Reviews />
          <GlobalPresence />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}

export default App;
