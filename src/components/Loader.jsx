import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0: loading, 1: reveal, 2: exit

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase(1), 200);
          setTimeout(() => setPhase(2), 1200);
          setTimeout(() => onComplete(), 2000);
          return 100;
        }
        const increment = prev < 60 ? Math.random() * 8 + 2 : Math.random() * 4 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#050505',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Background radial glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Animated rings */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: `${i * 200}px`, height: `${i * 200}px`,
                borderRadius: '50%',
                border: '1px solid rgba(255,107,0,0.15)',
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 1 }}
          >
            {/* Logo Icon */}
            <motion.div
              animate={phase === 1 ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] } : {}}
              transition={{ duration: 0.5 }}
              style={{
                width: '80px', height: '80px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
                borderRadius: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 60px rgba(255,107,0,0.5)',
                fontSize: '32px', fontWeight: '900',
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'white',
                letterSpacing: '-2px'
              }}
            >
              G
            </motion.div>

            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.1em' }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                fontSize: '22px', fontWeight: '700',
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'white', letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Guhanix
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                fontSize: '11px', fontWeight: '500',
                color: 'rgba(255,107,0,0.8)', letterSpacing: '0.3em',
                textTransform: 'uppercase', marginTop: '4px'
              }}
            >
              Technologies
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ width: '280px', position: 'relative', zIndex: 1 }}
          >
            <div style={{
              width: '100%', height: '2px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '2px', overflow: 'hidden'
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #FF6B00, #FF3B30)',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(255,107,0,0.8)',
                  width: `${progress}%`,
                  transition: 'width 0.1s ease'
                }}
              />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: '12px',
              fontSize: '11px', color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.05em'
            }}>
              <span>Initializing</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute', bottom: '40px',
              fontSize: '11px', color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            Engineering the Future
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
