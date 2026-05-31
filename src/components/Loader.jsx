import { useEffect, useState, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Mini galaxy for loader ─── */
function LoaderGalaxy() {
  const armsRef = useRef();
  const coreRef = useRef();

  const { positions, colors } = useMemo(() => {
    const count = 8000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const arm = i % 3;
      const base = (arm / 3) * Math.PI * 2;
      const r = Math.random() * 5 + 0.2;
      const angle = base + r * 3.2;
      const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35;
      const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.1;
      const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35;
      pos[i * 3]     = Math.cos(angle) * r + rx;
      pos[i * 3 + 1] = ry;
      pos[i * 3 + 2] = Math.sin(angle) * r + rz;
      const t = r / 5;
      const c0 = new THREE.Color('#FF6B00');
      const c1 = new THREE.Color('#FF3B30');
      const c2 = new THREE.Color('#1A8FFF');
      const fc = t < 0.5 ? c0.clone().lerp(c1, t * 2) : c1.clone().lerp(c2, (t - 0.5) * 2);
      col[i * 3] = fc.r; col[i * 3 + 1] = fc.g; col[i * 3 + 2] = fc.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const coreData = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 0.5;
      const t = Math.random() * Math.PI * 2;
      const p = Math.random() * Math.PI;
      pos[i * 3]     = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.cos(p) * 0.2;
      pos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
      col[i * 3] = 1; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 0.55;
    }
    return { pos, col };
  }, []);

  useFrame(({ clock }) => {
    if (armsRef.current) armsRef.current.rotation.y = clock.elapsedTime * 0.06;
    if (coreRef.current) coreRef.current.rotation.y = -clock.elapsedTime * 0.12;
  });

  return (
    <>
      <points ref={armsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.028} vertexColors transparent opacity={0.92} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[coreData.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[coreData.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.09} vertexColors transparent opacity={1} sizeAttenuation depthWrite={false} />
      </points>
    </>
  );
}

function OrbitRings() {
  const r1 = useRef(), r2 = useRef(), r3 = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (r1.current) { r1.current.rotation.z = t * 0.3; r1.current.rotation.x = t * 0.1; }
    if (r2.current) { r2.current.rotation.z = -t * 0.2; r2.current.rotation.y = t * 0.15; }
    if (r3.current) { r3.current.rotation.x = t * 0.25; r3.current.rotation.z = t * 0.08; }
  });
  return (
    <>
      <mesh ref={r1}><torusGeometry args={[3.2, 0.01, 8, 120]} /><meshBasicMaterial color="#FF6B00" transparent opacity={0.22} /></mesh>
      <mesh ref={r2}><torusGeometry args={[4.2, 0.007, 8, 120]} /><meshBasicMaterial color="#1A8FFF" transparent opacity={0.14} /></mesh>
      <mesh ref={r3}><torusGeometry args={[2.4, 0.012, 8, 120]} /><meshBasicMaterial color="#FF3B30" transparent opacity={0.18} /></mesh>
    </>
  );
}

function GalaxyScene() {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = 0.5 + Math.sin(clock.elapsedTime * 0.15) * 0.04;
    }
  });
  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#FF8C00" distance={8} />
      <pointLight position={[3, 2, 3]} intensity={1} color="#1A8FFF" distance={12} />
      <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.3} />
      <LoaderGalaxy />
      <OrbitRings />
    </group>
  );
}

/* ─── Loading text phases ─── */
const PHASES = ['Initializing systems', 'Loading AI modules', 'Calibrating interface', 'Launching experience'];

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setExiting(true), 300);
          setTimeout(() => onComplete(), 1100);
          return 100;
        }
        const inc = prev < 60 ? Math.random() * 7 + 2 : Math.random() * 3 + 1;
        return Math.min(prev + inc, 100);
      });
    }, 70);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.floor((progress / 100) * PHASES.length);
    setPhaseIdx(Math.min(idx, PHASES.length - 1));
  }, [progress]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#050A14',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Full-screen galaxy canvas */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas
              camera={{ position: [0, 4, 8], fov: 52 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 1.5]}
              style={{ width: '100%', height: '100%' }}
            >
              <Suspense fallback={null}>
                <GalaxyScene />
              </Suspense>
            </Canvas>
          </div>

          {/* Dark vignette overlay so text is readable */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(5,10,20,0.75) 70%, rgba(5,10,20,0.95) 100%)',
          }} />

          {/* Center content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: '32px' }}
            >
              {/* Pulsing glow ring */}
              <motion.div
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '110px', height: '110px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,107,0,0.35) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <img
                src="/src/assets/logo.svg"
                alt="Guhanix"
                style={{ width: '80px', height: '80px', borderRadius: '18px', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 20px rgba(255,107,0,0.6))' }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ marginBottom: '8px' }}
            >
              <span style={{ fontSize: '28px', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.04em' }}>
                <span style={{ color: '#1A8FFF' }}>GUHA</span><span style={{ color: '#FF6B00' }}>NIX</span>
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '48px' }}
            >
              TECHNOLOGY
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ width: '260px' }}
            >
              {/* Track */}
              <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #FF6B00, #1A8FFF)', boxShadow: '0 0 12px rgba(255,107,0,0.7)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Phase text + percent */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phaseIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.06em' }}
                  >
                    {PHASES[phaseIdx]}
                  </motion.span>
                </AnimatePresence>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#FF6B00', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute', bottom: '32px', zIndex: 2,
              fontSize: '10px', color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', sans-serif",
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
