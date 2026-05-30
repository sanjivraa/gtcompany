import { useScroll, motion } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #FF6B00, #FF3B30)',
        transformOrigin: '0%',
        scaleX: scrollYProgress,
        zIndex: 9999,
        boxShadow: '0 0 8px rgba(255,107,0,0.8)'
      }}
    />
  );
};

export default ScrollProgress;
