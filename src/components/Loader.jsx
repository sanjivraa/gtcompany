import { useEffect, useState, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ══════════════════════════════════════════════
   3-D GALAXY  (fills the whole screen)
══════════════════════════════════════════════ */
function GalaxyArms() {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const count = 12000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c0 = new THREE.Color('#FF6B00');
    const c1 = new THREE.Color('#FF3B30');
    const c2 = new THREE.Color('#1A8FFF');
    for (let i = 0; i < count; i++) {
      const arm   = i % 3;
      const base  = (arm / 3) * Math.PI * 2;
      const r     = Math.random() * 6 + 0.3;
      const angle = base + r * 3.0;
      const spread = 0.38;
      pos[i*3]   = Math.cos(angle)*r + (Math.random()-0.5)*spread*2;
      pos[i*3+1] = (Math.random()-0.5)*0.18;
      pos[i*3+2] = Math.sin(angle)*r + (Math.random()-0.5)*spread*2;
      const t  = r / 6;
      const fc = t < 0.5 ? c0.clone().lerp(c1, t*2) : c1.clone().lerp(c2, (t-0.5)*2);
      col[i*3]=fc.r; col[i*3+1]=fc.g; col[i*3+2]=fc.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.055;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function GalaxyCore() {
  const ref = useRef();
  const { pos, col } = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count*3);
    const col = new Float32Array(count*3);
    for (let i = 0; i < count; i++) {
      const r = Math.random()*0.55;
      const t = Math.random()*Math.PI*2;
      const p = Math.random()*Math.PI;
      pos[i*3]   = r*Math.sin(p)*Math.cos(t);
      pos[i*3+1] = r*Math.cos(p)*0.22;
      pos[i*3+2] = r*Math.sin(p)*Math.sin(t);
      col[i*3]=1; col[i*3+1]=0.88; col[i*3+2]=0.5;
    }
    return { pos, col };
  }, []);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = -clock.elapsedTime * 0.11; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={1} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function OrbitRings() {
  const r1=useRef(), r2=useRef(), r3=useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (r1.current) { r1.current.rotation.z = t*0.28; r1.current.rotation.x = t*0.09; }
    if (r2.current) { r2.current.rotation.z = -t*0.18; r2.current.rotation.y = t*0.13; }
    if (r3.current) { r3.current.rotation.x = t*0.22; r3.current.rotation.z = t*0.07; }
  });
  return (
    <>
      <mesh ref={r1}><torusGeometry args={[3.5,0.009,8,140]}/><meshBasicMaterial color="#FF6B00" transparent opacity={0.25}/></mesh>
      <mesh ref={r2}><torusGeometry args={[4.8,0.006,8,140]}/><meshBasicMaterial color="#1A8FFF" transparent opacity={0.16}/></mesh>
      <mesh ref={r3}><torusGeometry args={[2.6,0.011,8,140]}/><meshBasicMaterial color="#FF3B30" transparent opacity={0.20}/></mesh>
    </>
  );
}

function GalaxyScene({ progress }) {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Slowly tilt up as progress increases — feels like zooming into the galaxy
    groupRef.current.rotation.x = 0.48 + Math.sin(clock.elapsedTime * 0.12) * 0.03;
    groupRef.current.rotation.y = clock.elapsedTime * 0.008;
  });
  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.12} />
      <pointLight position={[0,0,0]} intensity={4}   color="#FF8C00" distance={9}  />
      <pointLight position={[4,3,4]} intensity={1.2} color="#1A8FFF" distance={14} />
      <pointLight position={[-3,-2,-4]} intensity={0.9} color="#FF3B30" distance={11} />
      <Stars radius={90} depth={60} count={4000} factor={3.5} saturation={0} fade speed={0.25} />
      <GalaxyArms />
      <GalaxyCore />
      <OrbitRings />
    </group>
  );
}

/* ══════════════════════════════════════════════
   LETTER-BY-LETTER BRAND REVEAL
══════════════════════════════════════════════ */
function BrandLetters() {
  const guha  = 'GUHA'.split('');
  const nix   = 'NIX'.split('');
  return (
    <div style={{ display:'flex', alignItems:'baseline', gap:0 }}>
      {guha.map((ch, i) => (
        <motion.span key={`g${i}`}
          initial={{ opacity:0, y:18, filter:'blur(8px)' }}
          animate={{ opacity:1, y:0,  filter:'blur(0px)' }}
          transition={{ duration:0.5, delay: 0.6 + i*0.07, ease:[0.22,1,0.36,1] }}
          style={{ fontSize:'36px', fontWeight:'900', fontFamily:"'Space Grotesk',sans-serif", color:'#1A8FFF', letterSpacing:'0.04em', lineHeight:1 }}
        >{ch}</motion.span>
      ))}
      {nix.map((ch, i) => (
        <motion.span key={`n${i}`}
          initial={{ opacity:0, y:18, filter:'blur(8px)' }}
          animate={{ opacity:1, y:0,  filter:'blur(0px)' }}
          transition={{ duration:0.5, delay: 0.88 + i*0.07, ease:[0.22,1,0.36,1] }}
          style={{ fontSize:'36px', fontWeight:'900', fontFamily:"'Space Grotesk',sans-serif", color:'#FF6B00', letterSpacing:'0.04em', lineHeight:1 }}
        >{ch}</motion.span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CIRCULAR PROGRESS RING
══════════════════════════════════════════════ */
function ProgressRing({ progress }) {
  const r   = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * (progress / 100);
  return (
    <svg width="130" height="130" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:2 }}>
      {/* track */}
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      {/* progress arc */}
      <motion.circle
        cx="65" cy="65" r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 0.15 }}
        style={{ transform:'rotate(-90deg)', transformOrigin:'65px 65px' }}
      />
      {/* glow dot at tip */}
      <motion.circle
        cx={65 + r * Math.cos((dash / circ) * 2 * Math.PI - Math.PI / 2)}
        cy={65 + r * Math.sin((dash / circ) * 2 * Math.PI - Math.PI / 2)}
        r="4"
        fill="#FF6B00"
        style={{ filter:'drop-shadow(0 0 6px #FF6B00)' }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#1A8FFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   PHASE LABELS
══════════════════════════════════════════════ */
const PHASES = [
  { label:'Initializing systems',   icon:'⚡' },
  { label:'Loading AI modules',     icon:'🧠' },
  { label:'Calibrating interface',  icon:'🎯' },
  { label:'Launching experience',   icon:'🚀' },
];

/* ══════════════════════════════════════════════
   CINEMATIC EXIT — two panels slide apart
══════════════════════════════════════════════ */
function ExitPanels({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="top"
            initial={{ y:0 }}
            animate={{ y:'-100%' }}
            exit={{}}
            transition={{ duration:0.9, ease:[0.76,0,0.24,1] }}
            style={{ position:'fixed', inset:0, bottom:'50%', zIndex:99998, background:'#050A14', pointerEvents:'none' }}
          />
          <motion.div
            key="bot"
            initial={{ y:0 }}
            animate={{ y:'100%' }}
            exit={{}}
            transition={{ duration:0.9, ease:[0.76,0,0.24,1] }}
            style={{ position:'fixed', inset:0, top:'50%', zIndex:99998, background:'#050A14', pointerEvents:'none' }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════
   MAIN LOADER
══════════════════════════════════════════════ */
const Loader = ({ onComplete }) => {
  const [progress, setProgress]   = useState(0);
  const [phaseIdx, setPhaseIdx]   = useState(0);
  const [stage, setStage]         = useState('loading'); // loading | complete | exit

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage('complete');
          setTimeout(() => setStage('exit'), 900);
          setTimeout(() => onComplete(), 1900);
          return 100;
        }
        const inc = prev < 50 ? Math.random()*8+3 : prev < 80 ? Math.random()*5+1.5 : Math.random()*2+0.8;
        return Math.min(prev + inc, 100);
      });
    }, 65);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor((progress / 100) * PHASES.length), PHASES.length - 1);
    setPhaseIdx(idx);
  }, [progress]);

  const isExiting = stage === 'exit';

  return (
    <>
      {/* Cinematic exit panels */}
      <ExitPanels visible={isExiting} />

      <AnimatePresence>
        {stage !== 'exit' && (
          <motion.div
            key="loader-bg"
            initial={{ opacity:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.3, delay:0.5 }}
            style={{ position:'fixed', inset:0, zIndex:99997, background:'#050A14', overflow:'hidden' }}
          >
            {/* ── Full-screen galaxy ── */}
            <div style={{ position:'absolute', inset:0, zIndex:0 }}>
              <Canvas camera={{ position:[0,4.2,8.5], fov:50 }} gl={{ antialias:true, alpha:true }} dpr={[1,1.5]} style={{ width:'100%', height:'100%' }}>
                <Suspense fallback={null}>
                  <GalaxyScene progress={progress} />
                </Suspense>
              </Canvas>
            </div>

            {/* ── Soft center spotlight (not a heavy vignette) ── */}
            <div style={{
              position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
              background:'radial-gradient(ellipse 55% 55% at 50% 50%, transparent 0%, rgba(5,10,20,0.55) 65%, rgba(5,10,20,0.88) 100%)',
            }} />

            {/* ── Scanline texture ── */}
            <div style={{
              position:'absolute', inset:0, zIndex:1, pointerEvents:'none', opacity:0.03,
              backgroundImage:'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 4px)',
            }} />

            {/* ══ CENTER CONTENT ══ */}
            <div style={{ position:'absolute', inset:0, zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>

              {/* Logo + ring */}
              <div style={{ position:'relative', width:'130px', height:'130px', marginBottom:'28px' }}>
                {/* Circular progress ring */}
                <ProgressRing progress={progress} />

                {/* Outer pulse rings */}
                {[1,2].map(i => (
                  <motion.div key={i}
                    animate={{ scale:[1, 1.6+i*0.3, 1], opacity:[0.25, 0, 0.25] }}
                    transition={{ duration:2.8, delay:i*0.7, repeat:Infinity, ease:'easeInOut' }}
                    style={{ position:'absolute', inset:`${-i*14}px`, borderRadius:'50%', border:'1px solid rgba(255,107,0,0.3)', pointerEvents:'none' }}
                  />
                ))}

                {/* Logo image */}
                <motion.div
                  initial={{ opacity:0, scale:0.5, rotate:-15 }}
                  animate={{ opacity:1, scale:1,   rotate:0   }}
                  transition={{ duration:0.9, delay:0.2, ease:[0.22,1,0.36,1] }}
                  style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:3 }}
                >
                  <motion.div
                    animate={stage === 'complete'
                      ? { scale:[1,1.15,1], filter:['drop-shadow(0 0 20px rgba(255,107,0,0.6))','drop-shadow(0 0 50px rgba(255,107,0,1))','drop-shadow(0 0 20px rgba(255,107,0,0.6))'] }
                      : { filter:'drop-shadow(0 0 20px rgba(255,107,0,0.6))' }
                    }
                    transition={{ duration:0.6 }}
                  >
                    <img src="/src/assets/logo.svg" alt="Guhanix"
                      style={{ width:'72px', height:'72px', borderRadius:'16px' }} />
                  </motion.div>
                </motion.div>

                {/* Percent inside ring */}
                <motion.div
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  transition={{ delay:0.5 }}
                  style={{ position:'absolute', bottom:'-28px', left:'50%', transform:'translateX(-50%)', fontSize:'11px', fontWeight:'700', color:'rgba(255,107,0,0.8)', fontFamily:"'Space Grotesk',sans-serif", whiteSpace:'nowrap' }}
                >
                  {Math.round(progress)}%
                </motion.div>
              </div>

              {/* Brand name — letter reveal */}
              <div style={{ marginTop:'20px', marginBottom:'6px' }}>
                <BrandLetters />
              </div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity:0, letterSpacing:'0.6em' }}
                animate={{ opacity:1, letterSpacing:'0.3em' }}
                transition={{ duration:1.2, delay:1.1 }}
                style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.3em', textTransform:'uppercase', fontFamily:"'Space Grotesk',sans-serif", marginBottom:'44px' }}
              >
                TECHNOLOGY
              </motion.div>

              {/* Phase indicator */}
              <motion.div
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.8 }}
                style={{ display:'flex', alignItems:'center', gap:'10px' }}
              >
                {/* Animated dots */}
                <div style={{ display:'flex', gap:'5px' }}>
                  {PHASES.map((_, i) => (
                    <motion.div key={i}
                      animate={{
                        background: i <= phaseIdx ? '#FF6B00' : 'rgba(255,255,255,0.12)',
                        scale: i === phaseIdx ? 1.4 : 1,
                      }}
                      transition={{ duration:0.3 }}
                      style={{ width:'5px', height:'5px', borderRadius:'50%' }}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={phaseIdx}
                    initial={{ opacity:0, x:10, filter:'blur(4px)' }}
                    animate={{ opacity:1, x:0,  filter:'blur(0px)' }}
                    exit={{   opacity:0, x:-10, filter:'blur(4px)' }}
                    transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                    style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', fontFamily:"'Space Grotesk',sans-serif", letterSpacing:'0.08em' }}
                  >
                    {PHASES[phaseIdx].icon} {PHASES[phaseIdx].label}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Horizontal progress bar (thin, below phase) */}
              <motion.div
                initial={{ opacity:0, scaleX:0 }}
                animate={{ opacity:1, scaleX:1 }}
                transition={{ delay:0.9, duration:0.6 }}
                style={{ width:'220px', marginTop:'20px' }}
              >
                <div style={{ width:'100%', height:'2px', background:'rgba(255,255,255,0.06)', borderRadius:'2px', overflow:'hidden', position:'relative' }}>
                  <motion.div
                    animate={{ width:`${progress}%` }}
                    transition={{ duration:0.12 }}
                    style={{ height:'100%', borderRadius:'2px', background:'linear-gradient(90deg,#FF6B00,#FF3B30,#1A8FFF)', position:'relative' }}
                  >
                    {/* Shimmer dot */}
                    <motion.div
                      animate={{ opacity:[0.6,1,0.6] }}
                      transition={{ duration:0.8, repeat:Infinity }}
                      style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', width:'6px', height:'6px', borderRadius:'50%', background:'white', boxShadow:'0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,107,0,0.8)' }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* ── Bottom tagline ── */}
            <motion.div
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:1.4 }}
              style={{ position:'absolute', bottom:'32px', left:0, right:0, zIndex:2, textAlign:'center' }}
            >
              <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.2)', letterSpacing:'0.28em', textTransform:'uppercase', fontFamily:"'Space Grotesk',sans-serif" }}>
                Engineering the Future
              </span>
            </motion.div>

            {/* ── Corner decorations ── */}
            {[
              { top:'24px',    left:'24px',    borderTop:'1px solid rgba(255,107,0,0.3)',  borderLeft:'1px solid rgba(255,107,0,0.3)'  },
              { top:'24px',    right:'24px',   borderTop:'1px solid rgba(26,143,255,0.3)', borderRight:'1px solid rgba(26,143,255,0.3)'},
              { bottom:'24px', left:'24px',    borderBottom:'1px solid rgba(255,107,0,0.3)',borderLeft:'1px solid rgba(255,107,0,0.3)' },
              { bottom:'24px', right:'24px',   borderBottom:'1px solid rgba(26,143,255,0.3)',borderRight:'1px solid rgba(26,143,255,0.3)'},
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity:0, scale:0.5 }}
                animate={{ opacity:1, scale:1 }}
                transition={{ delay:0.4+i*0.08, duration:0.5 }}
                style={{ position:'absolute', width:'28px', height:'28px', zIndex:2, ...s }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Loader;
