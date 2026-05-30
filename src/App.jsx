import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./components/Loader";
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
  const [loading, setLoading] = useState(true);
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <div className="noise-overlay" />
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
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
        )}
      </AnimatePresence>
    </>
  );
}
export default App;
