import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, Play, Star } from "lucide-react";

/* ─── Galaxy particles ─── */
function GalaxyCore() {
  const armsRef = useRef(), coreRef = useRef();
  const { positions, colors } = useMemo(() => {
    const count = 14000, pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const arm = i % 3, base = (arm / 3) * Math.PI * 2;
      const r = Math.random() * 6 + 0.2, angle = base + r * 3.2;
      const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4;
      const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.12;
      const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4;
      pos[i*3] = Math.cos(angle)*r+rx; pos[i*3+1] = ry; pos[i*3+2] = Math.sin(angle)*r+rz;
      const t = r/6;
      const c0 = new THREE.Color("#FF6B00"), c1 = new THREE.Color("#FF3B30"), c2 = new THREE.Color("#4040CC");
      const fc = t < 0.5 ? c0.clone().lerp(c1, t*2) : c1.clone().lerp(c2, (t-0.5)*2);
      col[i*3]=fc.r; col[i*3+1]=fc.g; col[i*3+2]=fc.b;
    }
    return { positions: pos, colors: col };
  }, []);
  const coreData = useMemo(() => {
    const count = 800, pos = new Float32Array(count*3), col = new Float32Array(count*3);
    for (let i = 0; i < count; i++) {
      const r=Math.random()*0.6, t=Math.random()*Math.PI*2, p=Math.random()*Math.PI;
      pos[i*3]=r*Math.sin(p)*Math.cos(t); pos[i*3+1]=r*Math.cos(p)*0.2; pos[i*3+2]=r*Math.sin(p)*Math.sin(t);
      col[i*3]=1; col[i*3+1]=0.85; col[i*3+2]=0.55;
    }
    return { pos, col };
  }, []);
  useFrame(({ clock }) => {
    if (armsRef.current) armsRef.current.rotation.y = clock.elapsedTime * 0.035;
    if (coreRef.current) coreRef.current.rotation.y = -clock.elapsedTime * 0.07;
  });
  return (
    <>
      <points ref={armsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[coreData.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[coreData.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.07} vertexColors transparent opacity={1} sizeAttenuation depthWrite={false} />
      </points>
    </>
  );
}

function NebulaDust() {
  const ref = useRef();
  const data = useMemo(() => {
    const count = 2500, pos = new Float32Array(count*3), col = new Float32Array(count*3);
    const palette = ["#FF6B00","#FF3B30","#7C3AED","#1a1aCC"].map(c => new THREE.Color(c));
    for (let i = 0; i < count; i++) {
      const r=1.5+Math.random()*4.5, t=Math.random()*Math.PI*2, p=(Math.random()-0.5)*0.4;
      pos[i*3]=r*Math.cos(t); pos[i*3+1]=r*Math.sin(p); pos[i*3+2]=r*Math.sin(t);
      const c = palette[Math.floor(Math.random()*palette.length)];
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    }
    return { pos, col };
  }, []);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.01; });
  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.038} vertexColors transparent opacity={0.28} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

function OrbitRings() {
  const r1=useRef(), r2=useRef(), r3=useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (r1.current) { r1.current.rotation.z=t*0.22; r1.current.rotation.x=t*0.07; }
    if (r2.current) { r2.current.rotation.z=-t*0.15; r2.current.rotation.y=t*0.11; }
    if (r3.current) { r3.current.rotation.x=t*0.18; r3.current.rotation.z=t*0.06; }
  });
  return (
    <>
      <mesh ref={r1}><torusGeometry args={[3.8,0.009,8,140]}/><meshBasicMaterial color="#FF6B00" transparent opacity={0.18}/></mesh>
      <mesh ref={r2}><torusGeometry args={[5.0,0.006,8,140]}/><meshBasicMaterial color="#4040CC" transparent opacity={0.10}/></mesh>
      <mesh ref={r3}><torusGeometry args={[2.8,0.011,8,140]}/><meshBasicMaterial color="#FF3B30" transparent opacity={0.14}/></mesh>
    </>
  );
}

function FloatingGem({ position, shape, color, speed, scale=1 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x += speed*0.006;
    ref.current.rotation.y += speed*0.009;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime*speed*0.3)*0.3;
  });
  const geo = shape==="oct" ? <octahedronGeometry args={[0.28*scale]}/>
            : shape==="tet" ? <tetrahedronGeometry args={[0.28*scale]}/>
            : shape==="dod" ? <dodecahedronGeometry args={[0.24*scale]}/>
            : <icosahedronGeometry args={[0.24*scale]}/>;
  return (
    <Float speed={speed*0.4} floatIntensity={0.3}>
      <mesh ref={ref} position={position}>
        {geo}
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.04}
          emissive={color} emissiveIntensity={0.6} transparent opacity={0.85}/>
      </mesh>
    </Float>
  );
}

function GalaxyScene({ mouseX, mouseY }) {
  const groupRef = useRef();
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.55 + mouseY.get()*0.05, 0.035);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.15 + mouseX.get()*0.05, 0.035);
  });
  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15}/>
      <pointLight position={[0,0,0]} intensity={4} color="#FF8C00" distance={9}/>
      <pointLight position={[3,3,4]} intensity={1.2} color="#4060FF" distance={14}/>
      <pointLight position={[-3,-2,-4]} intensity={0.8} color="#FF3B30" distance={11}/>
      <Stars radius={100} depth={60} count={5000} factor={4} saturation={0} fade speed={0.2}/>
      <GalaxyCore/><NebulaDust/><OrbitRings/>
      <FloatingGem position={[4.2,1.5,-1]} shape="oct" color="#FF6B00" speed={0.9} scale={1.1}/>
      <FloatingGem position={[5.5,-1.0,-2]} shape="tet" color="#4040CC" speed={0.6} scale={0.9}/>
      <FloatingGem position={[3.0,-2.2,1]} shape="ico" color="#FF3B30" speed={1.2} scale={0.8}/>
      <FloatingGem position={[5.2,2.5,-3]} shape="dod" color="#7C3AED" speed={0.45} scale={1.0}/>
    </group>
  );
}

function HeroReviewBadge() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    try { setReviews(JSON.parse(localStorage.getItem("guhanix_reviews")||"[]")); } catch { setReviews([]); }
  }, []);
  const avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : "5.0";
  const count = reviews.length;
  return (
    <motion.div
      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1, duration:0.5 }}
      onClick={() => document.querySelector("#reviews")?.scrollIntoView({ behavior:"smooth" })}
      style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"100px", padding:"6px 14px", cursor:"pointer", backdropFilter:"blur(12px)" }}
    >
      <div style={{ display:"flex", gap:"2px" }}>
        {[1,2,3,4,5].map(s => (
          <Star key={s} size={11}
            fill={s<=Math.round(parseFloat(avg))?"#FF6B00":"transparent"}
            color={s<=Math.round(parseFloat(avg))?"#FF6B00":"rgba(255,255,255,0.2)"}/>
        ))}
      </div>
      <span style={{ fontSize:"12px", fontWeight:"700", color:"white" }}>{avg}</span>
      <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.38)" }}>
        {count > 0 ? `${count} review${count!==1?"s":""}` : "Be first to review"}
      </span>
    </motion.div>
  );
}

const ease = [0.22, 1, 0.36, 1];

/* ══════════════════════════════════════════════════════════
   HERO  —  split layout using position:absolute for canvas
   Text is in normal flow on the LEFT.
   Canvas is position:absolute covering the RIGHT half.
   This guarantees text never overlaps galaxy.
══════════════════════════════════════════════════════════ */
const Hero = () => {
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness:35, damping:18 });
  const springY = useSpring(mouseY, { stiffness:35, damping:18 });

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX/r.width - 0.5)*2);
    mouseY.set((e.clientY/r.height - 0.5)*2);
  };

  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior:"smooth" });

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      style={{ position:"relative", minHeight:"100vh", background:"#020208", overflow:"hidden" }}
    >
      {/* ── deep space bg ── */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse 120% 100% at 70% 50%, rgba(14,0,30,0.85) 0%, #020208 55%)" }}/>

      {/* ── galaxy canvas — covers RIGHT 55% absolutely ── */}
      <div style={{
        position:"absolute", top:0, right:0,
        width:"55%", height:"100%",
        zIndex:1, pointerEvents:"none"
      }}>
        {/* left-edge fade so galaxy doesn't bleed into text */}
        <div style={{
          position:"absolute", top:0, left:0, bottom:0,
          width:"45%", zIndex:2, pointerEvents:"none",
          background:"linear-gradient(to right, #020208 0%, transparent 100%)"
        }}/>
        <Canvas
          camera={{ position:[0, 4.5, 8], fov:48 }}
          gl={{ antialias:true, alpha:true }}
          dpr={[1, 1.5]}
          style={{ width:"100%", height:"100%" }}
        >
          <Suspense fallback={null}>
            <GalaxyScene mouseX={springX} mouseY={springY}/>
          </Suspense>
        </Canvas>
      </div>

      {/* ── glow orb behind galaxy ── */}
      <div style={{
        position:"absolute", top:"50%", right:"15%", transform:"translateY(-50%)",
        width:"420px", height:"420px", borderRadius:"50%", zIndex:1, pointerEvents:"none",
        background:"radial-gradient(circle, rgba(255,107,0,0.1) 0%, rgba(100,40,200,0.04) 55%, transparent 70%)"
      }}/>

      {/* ══════════════════════════════════════
          TEXT — in normal flow, LEFT side
          max-width 48% keeps it off the galaxy
          ══════════════════════════════════════ */}
      <div style={{
        position:"relative", zIndex:10,
        minHeight:"100vh",
        display:"flex", alignItems:"center",
        paddingLeft:"clamp(24px, 6vw, 100px)",
        paddingTop:"100px", paddingBottom:"80px",
        paddingRight:"0",
        width:"48%",          /* ← text column width */
        boxSizing:"border-box"
      }}>
        <div style={{ width:"100%" }}>

          {/* badges */}
          <motion.div
            initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.6, delay:0.2, ease }}
            style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"28px", flexWrap:"wrap" }}
          >
            <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.28)", borderRadius:"100px", padding:"5px 14px" }}>
              <motion.div
                animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }}
                transition={{ duration:1.6, repeat:Infinity }}
                style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#FF6B00" }}
              />
              <span style={{ fontSize:"11px", fontWeight:"600", color:"#FF6B00", letterSpacing:"0.07em" }}>
                🚀 Launched 2026 · Building the Future
              </span>
            </div>
            <HeroReviewBadge/>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity:0, x:-60 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.85, delay:0.35, ease }}
            style={{
              fontSize:"clamp(30px, 3.5vw, 56px)",
              fontWeight:"900", lineHeight:"1.12",
              letterSpacing:"-0.03em", marginBottom:"20px",
              fontFamily:"'Space Grotesk', sans-serif",
              textAlign:"left", color:"white"
            }}
          >
            Engineering the{" "}
            <span style={{
              background:"linear-gradient(135deg,#FF6B00 0%,#FF3B30 50%,#FF8C00 100%)",
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              animation:"shimmer 3s linear infinite"
            }}>Future</span>
            {" "}Through{" "}
            <span style={{
              background:"linear-gradient(135deg,#00BFFF,#7C3AED)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text"
            }}>Intelligent</span>
            {" "}Technology
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.75, delay:0.52, ease }}
            style={{ fontSize:"clamp(13px,1.2vw,15px)", color:"rgba(255,255,255,0.48)", lineHeight:"1.8", marginBottom:"36px", fontWeight:"400", textAlign:"left" }}
          >
            A bold new technology company founded in 2026 — building transformative AI solutions,
            enterprise software, and digital experiences that redefine what is possible.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.7, delay:0.66, ease }}
            style={{ display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center" }}
          >
            <motion.button
              onClick={() => scrollTo("#services")}
              whileHover={{ scale:1.04, boxShadow:"0 0 55px rgba(255,107,0,0.55)" }}
              whileTap={{ scale:0.97 }}
              style={{ display:"flex", alignItems:"center", gap:"9px", background:"linear-gradient(135deg,#FF6B00,#FF3B30)", color:"white", border:"none", padding:"13px 26px", borderRadius:"12px", fontSize:"14px", fontWeight:"700", cursor:"pointer", boxShadow:"0 0 36px rgba(255,107,0,0.32)" }}
            >
              Explore Solutions <ArrowRight size={16}/>
            </motion.button>
            <motion.button
              onClick={() => scrollTo("#contact")}
              whileHover={{ scale:1.04, borderColor:"rgba(255,107,0,0.45)", background:"rgba(255,255,255,0.07)" }}
              whileTap={{ scale:0.97 }}
              style={{ display:"flex", alignItems:"center", gap:"9px", background:"rgba(255,255,255,0.04)", color:"white", border:"1px solid rgba(255,255,255,0.13)", padding:"13px 26px", borderRadius:"12px", fontSize:"14px", fontWeight:"600", cursor:"pointer", backdropFilter:"blur(12px)" }}
            >
              <Play size={13} fill="currentColor"/> Schedule a Consultation
            </motion.button>
          </motion.div>

          {/* stats */}
          <motion.div
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.85, ease }}
            style={{ display:"flex", gap:"28px", marginTop:"44px", flexWrap:"wrap" }}
          >
            {[
              { value:"2026", label:"Founded"    },
              { value:"∞",    label:"Ambition"   },
              { value:"100%", label:"Commitment" },
              { value:"24/7", label:"Support"    },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.92+i*0.07, ease }}
                whileHover={{ y:-3 }}
              >
                <div style={{ fontSize:"clamp(18px,2vw,26px)", fontWeight:"800", fontFamily:"'Space Grotesk',sans-serif", letterSpacing:"-0.02em", background:"linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  {s.value}
                </div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"2px" }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.7 }}
        style={{ position:"absolute", bottom:"28px", left:"24%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", zIndex:10 }}
      >
        <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.2)", letterSpacing:"0.22em", textTransform:"uppercase" }}>Scroll</span>
        <motion.div
          animate={{ y:[0,9,0], opacity:[0.4,0.9,0.4] }} transition={{ duration:1.7, repeat:Infinity }}
          style={{ width:"1px", height:"38px", background:"linear-gradient(to bottom,rgba(255,107,0,0.85),transparent)" }}
        />
      </motion.div>

      <style>{`
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @media (max-width: 900px) {
          #hero > div:nth-child(3) { width:100% !important; height:50vh !important; top:auto !important; position:relative !important; }
          #hero > div:nth-child(6) { width:100% !important; padding:100px 24px 40px !important; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
