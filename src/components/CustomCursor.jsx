import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

/* ─── Trail particle ─── */
function TrailParticle({ x, y, color, size, opacity }) {
  return (
    <motion.div
      initial={{ opacity, scale: 1 }}
      animate={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left: x, top: y,
        x: '-50%', y: '-50%',
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        pointerEvents: 'none',
        zIndex: 99996,
        filter: `blur(${size * 0.4}px)`,
      }}
    />
  );
}

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // default | hover | click | text
  const [particles, setParticles] = useState([]);
  const [label, setLabel] = useState('');

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const ringX = useMotionValue(-200);
  const ringY = useMotionValue(-200);

  // Dot — snappy
  const dotX = useSpring(mouseX, { stiffness: 800, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 50 });

  // Ring — laggy for trail effect
  const smoothRingX = useSpring(ringX, { stiffness: 120, damping: 22 });
  const smoothRingY = useSpring(ringY, { stiffness: 120, damping: 22 });

  const lastParticle = useRef(0);
  const particleId = useRef(0);

  const spawnParticle = useCallback((x, y, state) => {
    const now = Date.now();
    if (now - lastParticle.current < 40) return;
    lastParticle.current = now;

    const colors = state === 'hover'
      ? ['rgba(255,107,0,0.7)', 'rgba(255,59,48,0.5)', 'rgba(255,140,0,0.6)']
      : ['rgba(26,143,255,0.5)', 'rgba(255,107,0,0.4)', 'rgba(255,255,255,0.3)'];

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 5 + 2;
    const id = particleId.current++;

    setParticles(prev => [
      ...prev.slice(-18),
      { id, x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 8, color, size, opacity: 0.7 }
    ]);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      setVisible(true);
      spawnParticle(e.clientX, e.clientY, cursorState);
    };

    const onDown = () => setCursorState('click');
    const onUp = () => setCursorState(prev => prev === 'click' ? 'default' : prev);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e) => {
      const el = e.target;
      const isClickable =
        el.tagName === 'BUTTON' || el.tagName === 'A' ||
        el.closest('button') || el.closest('a') ||
        el.getAttribute('role') === 'button' ||
        window.getComputedStyle(el).cursor === 'pointer';
      const isText =
        el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ||
        el.getAttribute('contenteditable');

      if (isText) {
        setCursorState('text');
        setLabel('');
      } else if (isClickable) {
        setCursorState('hover');
        // grab data-cursor-label if present
        const lbl = el.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') || '';
        setLabel(lbl);
      } else {
        setCursorState('default');
        setLabel('');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
    };
  }, [cursorState, spawnParticle]);

  if (!visible) return null;

  const isHover = cursorState === 'hover';
  const isClick = cursorState === 'click';
  const isText  = cursorState === 'text';

  return (
    <>
      {/* Trail particles */}
      <AnimatePresence>
        {particles.map(p => (
          <TrailParticle key={p.id} {...p} />
        ))}
      </AnimatePresence>

      {/* Outer ring — lags behind */}
      <motion.div
        style={{
          position: 'fixed',
          left: smoothRingX, top: smoothRingY,
          x: '-50%', y: '-50%',
          zIndex: 99997,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{
            width:  isClick ? '22px' : isHover ? '52px' : isText ? '4px' : '38px',
            height: isClick ? '22px' : isHover ? '52px' : isText ? '32px' : '38px',
            borderRadius: isText ? '2px' : '50%',
            borderColor: isHover ? 'rgba(255,107,0,0.7)' : isClick ? 'rgba(26,143,255,0.8)' : 'rgba(255,255,255,0.25)',
            opacity: isHover ? 0.9 : 0.5,
            rotate: isHover ? 45 : 0,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            border: '1.5px solid rgba(255,255,255,0.25)',
            borderRadius: '50%',
          }}
        />
        {/* Rotating arc on hover */}
        {isHover && (
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ opacity: { duration: 0.2 }, rotate: { duration: 1.5, repeat: Infinity, ease: 'linear' } }}
            style={{
              position: 'absolute', inset: '-6px',
              borderRadius: '50%',
              border: '1.5px solid transparent',
              borderTopColor: '#FF6B00',
              borderRightColor: 'rgba(255,107,0,0.3)',
            }}
          />
        )}
      </motion.div>

      {/* Inner dot — snappy */}
      <motion.div
        style={{
          position: 'fixed',
          left: dotX, top: dotY,
          x: '-50%', y: '-50%',
          zIndex: 99999,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          animate={{
            width:  isClick ? '5px' : isHover ? '12px' : isText ? '2px' : '8px',
            height: isClick ? '5px' : isHover ? '12px' : isText ? '20px' : '8px',
            borderRadius: isText ? '1px' : '50%',
            background: isHover
              ? 'linear-gradient(135deg, #FF6B00, #FF3B30)'
              : isClick
              ? '#1A8FFF'
              : 'white',
            boxShadow: isHover
              ? '0 0 16px rgba(255,107,0,0.9), 0 0 32px rgba(255,107,0,0.4)'
              : isClick
              ? '0 0 16px rgba(26,143,255,0.9)'
              : '0 0 8px rgba(255,255,255,0.6)',
            opacity: isText ? 0.9 : 1,
          }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Label tooltip on hover */}
      <AnimatePresence>
        {isHover && label && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              left: dotX, top: dotY,
              x: '-50%',
              y: '20px',
              zIndex: 99998,
              pointerEvents: 'none',
              background: 'rgba(5,10,20,0.9)',
              border: '1px solid rgba(255,107,0,0.3)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#FF6B00',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(12px)',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        * { cursor: none !important; }
        @media (max-width: 768px) { * { cursor: auto !important; } }
      `}</style>
    </>
  );
};

export default CustomCursor;
