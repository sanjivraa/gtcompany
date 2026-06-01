import { useEffect, useState, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ══════════════════════════════════════════════
   PROPER SPIRAL GALAXY
   - 2 main arms + 2 minor arms (logarithmic spiral)
   - Bright dense core bulge
   - Dust / nebula haze layer
   - Outer halo scatter
   - Thin disc thickness (realistic)
══════════════════════════════════════════════ */

/** Logarithmic spiral: r = a * e^(b*θ) → θ = ln(r/a)/b */
function spiralAngle(r, tightness = 0.35) {
  return tightness * Math.log(r + 1);
}

function SpiralGalaxy() {
  const discRef  = useRef();
  const coreRef  = useRef();
  const hazeRef  = useRef();
  const haloRef  = useRef();

  /* ── Spiral disc arms ── */
  const disc = useMemo(() => {
    const NUM_ARMS   = 2;          // 2 main arms (+ 2 minor offset by π)
    const STARS      = 18000;
    const pos = new Float32Array(STARS * 3);
    const col = new Float32Array(STARS * 3);

    const cInner = new THREE.Color('#FFD580'); // warm yellow-white near core
    const cMid   = new THREE.Color('#FF6B00'); // orange mid-arm
    const cOuter = new THREE.Color('#1A8FFF'); // blue outer arm tips

    for (let i = 0; i < STARS; i++) {
      /* which arm (0,1 = main; 2,3 = minor offset by π + small angle) */
      const armIdx   = i % (NUM_ARMS * 2);
      const armAngle = (armIdx / (NUM_ARMS * 2)) * Math.PI * 2;

      /* radial distance — exponential distribution so core is denser */
      const u = Math.random();
      const r = 0.15 + Math.pow(u, 0.6) * 6.8;   // 0.15 → 6.95

      /* logarithmic spiral angle */
      const theta = armAngle + spiralAngle(r, 0.38);

      /* arm width grows with radius */
      const armWidth = 0.06 + r * 0.055;
      const spread   = (Math.random() - 0.5) * armWidth * 2;

      /* disc thickness — very thin, flares slightly at edge */
      const thickness = 0.04 + r * 0.012;
      const dy = (Math.random() - 0.5) * thickness;

      pos[i*3]   = Math.cos(theta) * r + spread * Math.sin(theta);
      pos[i*3+1] = dy;
      pos[i*3+2] = Math.sin(theta) * r - spread * Math.cos(theta);

      /* colour: warm core → orange mid → blue tips */
      const t = Math.min(r / 6.8, 1);
      let fc;
      if (t < 0.25)      fc = cInner.clone().lerp(cMid,   t / 0.25);
      else if (t < 0.65) fc = cMid.clone().lerp(cOuter,   (t - 0.25) / 0.4);
      else               fc = cOuter.clone().lerp(new THREE.Color('#0A4BAF'), (t - 0.65) / 0.35);

      /* brightness falloff */
      const bright = 0.55 + 0.45 * Math.exp(-r * 0.18);
      col[i*3]   = fc.r * bright;
      col[i*3+1] = fc.g * bright;
      col[i*3+2] = fc.b * bright;
    }
    return { pos, col };
  }, []);

  /* ── Dense bright core bulge ── */
  const core = useMemo(() => {
    const N   = 2200;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      /* Gaussian distribution for bulge */
      const r  = Math.abs(gaussRand() * 0.55);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.random() * Math.PI;
      pos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      pos[i*3+1] = r * Math.cos(ph) * 0.55;   // slightly flattened
      pos[i*3+2] = r * Math.sin(ph) * Math.sin(th);
      /* warm white → yellow */
      const t = r / 0.55;
      col[i*3]   = 1;
      col[i*3+1] = 0.88 - t * 0.18;
      col[i*3+2] = 0.55 - t * 0.35;
    }
    return { pos, col };
  }, []);

  /* ── Nebula dust haze (large diffuse particles) ── */
  const haze = useMemo(() => {
    const N   = 1800;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const palette = [
      new THREE.Color('#FF6B00'),
      new THREE.Color('#FF3B30'),
      new THREE.Color('#1A8FFF'),
      new THREE.Color('#0A4BAF'),
    ];
    for (let i = 0; i < N; i++) {
      const r  = 0.5 + Math.random() * 5.5;
      const th = Math.random() * Math.PI * 2;
      pos[i*3]   = Math.cos(th) * r + (Math.random()-0.5) * 1.2;
      pos[i*3+1] = (Math.random()-0.5) * 0.22;
      pos[i*3+2] = Math.sin(th) * r + (Math.random()-0.5) * 1.2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    }
    return { pos, col };
  }, []);

  /* ── Outer halo (sparse, faint) ── */
  const halo = useMemo(() => {
    const N   = 1200;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r  = 5 + Math.random() * 4;
      const th = Math.random() * Math.PI * 2;
      const ph = (Math.random() - 0.5) * 0.9;
      pos[i*3]   = Math.cos(th) * r;
      pos[i*3+1] = ph * r * 0.15;
      pos[i*3+2] = Math.sin(th) * r;
      col[i*3]=0.4; col[i*3+1]=0.5; col[i*3+2]=0.7;
    }
    return { pos, col };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (discRef.current)  discRef.current.rotation.y  =  t * 0.045;
    if (coreRef.current)  coreRef.current.rotation.y  = -t * 0.025;
    if (hazeRef.current)  hazeRef.current.rotation.y  =  t * 0.018;
    if (haloRef.current)  haloRef.current.rotation.y  =  t * 0.010;
  });

  return (
    <>
      {/* Spiral disc */}
      <points ref={discRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[disc.pos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[disc.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} vertexColors transparent opacity={0.92} sizeAttenuation depthWrite={false} />
      </points>

      {/* Core bulge */}
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[core.pos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[core.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.075} vertexColors transparent opacity={1} sizeAttenuation depthWrite={false} />
      </points>

      {/* Nebula haze */}
      <points ref={hazeRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[haze.pos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[haze.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.055} vertexColors transparent opacity={0.22} sizeAttenuation depthWrite={false} />
      </points>

      {/* Outer halo */}
      <points ref={haloRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[halo.pos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[halo.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.018} vertexColors transparent opacity={0.35} sizeAttenuation depthWrite={false} />
      </points>
    </>
  );
}

/* Box-Muller Gaussian random */
function gaussRand() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function GalaxyScene() {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    /* Gentle tilt so we see the disc at ~25° — classic galaxy view */
    groupRef.current.rotation.x = 0.42 + Math.sin(clock.elapsedTime * 0.10) * 0.025;
  });
  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.08} />
      <pointLight position={[0,0,0]}    intensity={5}   color="#FFD580" distance={6}  />
      <pointLight position={[0,2,0]}    intensity={1.5} color="#FF8C00" distance={10} />
      <pointLight position={[5,3,5]}    intensity={0.8} color="#1A8FFF" distance={16} />
      <pointLight position={[-4,-2,-5]} intensity={0.6} color="#FF3B30" distance={12} />
      <Stars radius={100} depth={70} count={5000} factor={4} saturation={0} fade speed={0.2} />
      <SpiralGalaxy />
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
              <Canvas camera={{ position:[0,5.5,11], fov:46 }} gl={{ antialias:true, alpha:true }} dpr={[1,1.5]} style={{ width:'100%', height:'100%' }}>
                <Suspense fallback={null}>
                  <GalaxyScene progress={progress} />
                </Suspense>
              </Canvas>
            </div>

            {/* ── Soft center spotlight (not a heavy vignette) ── */}
            <div style={{
              position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
              background:'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(5,10,20,0.35) 70%, rgba(5,10,20,0.82) 100%)',
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
