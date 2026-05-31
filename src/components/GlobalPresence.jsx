import { useRef, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Reveal, Stagger, StaggerChild } from './AnimatedSection';
import { MapPin, Users, Globe2, Building2 } from 'lucide-react';

const locations = [
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, clients: 18, color: '#FF6B00' },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, clients: 12, color: '#1A8FFF' },
  { city: 'Singapore', country: 'SG', lat: 1.3521, lng: 103.8198, clients: 9, color: '#10B981' },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, clients: 7, color: '#F59E0B' },
  { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, clients: 11, color: '#0A6FD4' },
  { city: 'Sydney', country: 'AUS', lat: -33.8688, lng: 151.2093, clients: 5, color: '#FF3B30' },
];

const stats = [
  { icon: Globe2, value: '15+', label: 'Countries Served' },
  { icon: Building2, value: '50+', label: 'Enterprise Clients' },
  { icon: Users, value: '80+', label: 'Team Members' },
  { icon: MapPin, value: '6', label: 'Global Hubs' },
];

/* ---- 3D Earth Globe ---- */
function EarthGlobe() {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y += 0.002;
    }
  });

  // Generate location dots on sphere surface
  const locationDots = locations.map((loc) => {
    const phi = (90 - loc.lat) * (Math.PI / 180);
    const theta = (loc.lng + 180) * (Math.PI / 180);
    const r = 2.05;
    return {
      x: -(r * Math.sin(phi) * Math.cos(theta)),
      y: r * Math.cos(phi),
      z: r * Math.sin(phi) * Math.sin(theta),
      color: loc.color
    };
  });

  return (
    <group>
      {/* Main globe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#0a1628"
          metalness={0.3}
          roughness={0.7}
          emissive="#001133"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[2.01, 24, 24]} />
        <meshBasicMaterial color="#1A8FFF" wireframe opacity={0.06} transparent />
      </mesh>

      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshBasicMaterial color="#FF6B00" opacity={0.03} transparent side={THREE.BackSide} />
      </mesh>

      {/* Location dots */}
      {locationDots.map((dot, i) => (
        <group key={i} position={[dot.x, dot.y, dot.z]}>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={dot.color}
              emissive={dot.color}
              emissiveIntensity={1}
            />
          </mesh>
          {/* Pulse ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.01, 8, 32]} />
            <meshBasicMaterial color={dot.color} opacity={0.5} transparent />
          </mesh>
        </group>
      ))}

      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[2.8, 0.008, 8, 100]} />
        <meshBasicMaterial color="#FF6B00" opacity={0.12} transparent />
      </mesh>
    </group>
  );
}

const GlobalPresence = () => {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="global"
      ref={ref}
      className="section-padding"
      style={{
        background: 'linear-gradient(180deg, #050A14 0%, #080f1c 50%, #050A14 100%)',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(26,143,255,0.04) 0%, transparent 70%)'
      }} />

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>Global Reach</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', marginBottom: '20px' }}>
            Serving Clients{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Worldwide
            </span>
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
            From Silicon Valley to Singapore, our technology solutions power businesses across 15+ countries.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px', marginBottom: '80px'
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -6, borderColor: 'rgba(255,107,0,0.3)' }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '24px',
                textAlign: 'center', transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                background: 'rgba(255,107,0,0.1)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <stat.icon size={20} color="#FF6B00" />
              </div>
              <div style={{
                fontSize: '28px', fontWeight: '800',
                fontFamily: "'Space Grotesk', sans-serif",
                background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Globe + Locations */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px', alignItems: 'center'
        }}>
          {/* 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ height: '500px', position: 'relative' }}
          >
            {/* Glow behind globe */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px', height: '300px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(26,143,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: 0
            }} />
            <Canvas
              camera={{ position: [0, 0, 6], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 1.5]}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={2} color="#FF6B00" />
              <pointLight position={[-10, -5, -10]} intensity={1} color="#1A8FFF" />
              <Stars radius={80} depth={50} count={2000} factor={2} saturation={0} fade speed={0.3} />
              <Suspense fallback={null}>
                <EarthGlobe />
              </Suspense>
            </Canvas>
          </motion.div>

          {/* Location Cards */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}
            >
              Our Global Hubs
            </motion.h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {locations.map((loc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                  whileHover={{ x: 6, borderColor: `${loc.color}40` }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px', padding: '16px 20px',
                    transition: 'all 0.3s ease', cursor: 'default'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: loc.color,
                      boxShadow: `0 0 10px ${loc.color}80`,
                      flexShrink: 0
                    }} />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{loc.city}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>{loc.country}</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px', fontWeight: '700',
                    color: loc.color,
                    background: `${loc.color}12`,
                    border: `1px solid ${loc.color}25`,
                    padding: '4px 10px', borderRadius: '100px'
                  }}>
                    {loc.clients} Clients
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Network visualization hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{
                marginTop: '24px',
                background: 'rgba(255,107,0,0.06)',
                border: '1px solid rgba(255,107,0,0.15)',
                borderRadius: '14px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF6B00', flexShrink: 0 }}
              />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                24/7 global support across all time zones
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;
