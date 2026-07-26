import { useScroll, motion, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <>
      {/* Main bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '2.5px',
          background: 'linear-gradient(90deg, #FF6B00 0%, #FF3B30 40%, #1A8FFF 100%)',
          transformOrigin: '0%',
          scaleX: smooth,
          zIndex: 10000,
        }}
      />
      {/* Glow underneath */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '10px',
          background: 'linear-gradient(90deg, rgba(255,107,0,0.4) 0%, rgba(26,143,255,0.3) 100%)',
          transformOrigin: '0%',
          scaleX: smooth,
          zIndex: 9999,
          filter: 'blur(6px)',
          opacity: 0.7,
        }}
      />
    </>
  );
};

export default ScrollProgress;
