import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 40 };
  const trailConfig = { stiffness: 150, damping: 20 };

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const trailSmoothX = useSpring(trailX, trailConfig);
  const trailSmoothY = useSpring(trailY, trailConfig);

  useEffect(() => {
    // Only show on desktop
    if (window.innerWidth < 768) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleHoverStart = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail / outer ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: trailSmoothX,
          top: trailSmoothY,
          x: '-50%',
          y: '-50%',
          zIndex: 99998,
          pointerEvents: 'none',
          mixBlendMode: 'difference'
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? '48px' : isClicking ? '20px' : '36px',
            height: isHovering ? '48px' : isClicking ? '20px' : '36px',
            opacity: isHovering ? 0.6 : 0.3,
            borderColor: isHovering ? '#FF6B00' : 'rgba(255,255,255,0.6)'
          }}
          transition={{ duration: 0.2 }}
          style={{
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.6)',
          }}
        />
      </motion.div>

      {/* Main dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: smoothX,
          top: smoothY,
          x: '-50%',
          y: '-50%',
          zIndex: 99999,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          animate={{
            width: isClicking ? '6px' : isHovering ? '10px' : '8px',
            height: isClicking ? '6px' : isHovering ? '10px' : '8px',
            background: isHovering ? '#FF6B00' : 'white',
            boxShadow: isHovering ? '0 0 12px rgba(255,107,0,0.8)' : '0 0 6px rgba(255,255,255,0.5)'
          }}
          transition={{ duration: 0.15 }}
          style={{ borderRadius: '50%' }}
        />
      </motion.div>

      <style>{`
        * { cursor: none !important; }
        @media (max-width: 768px) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
