import { useRef, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Reveal, Stagger, StaggerChild } from "./AnimatedSection";

const techStack = [
  { name: "React",       color: "#61DAFB", category: "Frontend"  },
  { name: "Next.js",     color: "#ffffff", category: "Frontend"  },
  { name: "Three.js",    color: "#049EF4", category: "Frontend"  },
  { name: "Flutter",     color: "#54C5F8", category: "Mobile"    },
  { name: "Kotlin",      color: "#7F52FF", category: "Mobile"    },
  { name: "Python",      color: "#FFD43B", category: "AI/ML"     },
  { name: "TensorFlow",  color: "#FF6F00", category: "AI/ML"     },
  { name: "Node.js",     color: "#68A063", category: "Backend"   },
  { name: "TypeScript",  color: "#3178C6", category: "Language"  },
  { name: "AWS",         color: "#FF9900", category: "Cloud"     },
  { name: "Docker",      color: "#2496ED", category: "DevOps"    },
  { name: "Kubernetes",  color: "#326CE5", category: "DevOps"    },
  { name: "GraphQL",     color: "#E10098", category: "API"       },
  { name: "PostgreSQL",  color: "#336791", category: "Database"  },
  { name: "Redis",       color: "#DC382D", category: "Database"  },
  { name: "Figma",       color: "#F24E1E", category: "Design"    },
];

function TechSphere() {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });
  const radius = 3;
  const items = techStack.slice(0, 12);
  return (
    <group ref={groupRef}>
      <Float speed={1} floatIntensity={0.3}>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color="#FF6B00" metalness={0.9} roughness={0.1} emissive="#FF3B30" emissiveIntensity={0.3} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.85, 16, 16]} />
          <meshBasicMaterial color="#FF6B00" wireframe opacity={0.15} transparent />
        </mesh>
      </Float>
      {items.map((tech, i) => {
        const phi = Math.acos(-1 + (2 * i) / items.length);
        const theta = Math.sqrt(items.length * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={tech.color} metalness={0.8} roughness={0.2} emissive={tech.color} emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
      {[2.5, 3.0, 3.5].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
          <torusGeometry args={[r, 0.008, 8, 100]} />
          <meshBasicMaterial color="#FF6B00" opacity={0.08 - i * 0.02} transparent />
        </mesh>
      ))}
    </group>
  );
}

const Technology = () => {
  const categories = [...new Set(techStack.map(t => t.category))];

  return (
    <section id="technology" className="section-padding" style={{
      background: "linear-gradient(180deg,#050A14 0%,#080f1c 50%,#050A14 100%)",
      position: "relative", overflow: "hidden"
    }}>
      <div className="container">
        <Reveal dir="up" style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Tech Stack</div>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: "800", marginBottom: "16px" }}>
            Powered by{" "}
            <span style={{ background: "linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Cutting-Edge
            </span>{" "}Technology
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "540px", margin: "0 auto", lineHeight: "1.7" }}>
            We leverage the most advanced tools and frameworks to build solutions that stand the test of time.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "60px", alignItems: "center" }}>
          <Reveal dir="left" delay={0.1} style={{ height: "460px", position: "relative" }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={2} color="#FF6B00" />
              <pointLight position={[-10, -10, -10]} intensity={1} color="#1A8FFF" />
              <Suspense fallback={null}><TechSphere /></Suspense>
            </Canvas>
          </Reveal>

          <Stagger stagger={0.07} initialDelay={0.15}>
            {categories.map((cat) => (
              <StaggerChild key={cat} dir="right">
                <div style={{ marginBottom: "22px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>
                    {cat}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {techStack.filter(t => t.category === cat).map((tech, i) => (
                      <motion.div key={i}
                        whileHover={{ scale: 1.1, y: -3, boxShadow: `0 6px 20px ${tech.color}30` }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          display: "flex", alignItems: "center", gap: "8px",
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${tech.color}25`,
                          borderRadius: "10px", padding: "8px 14px",
                          cursor: "default", transition: "all 0.2s"
                        }}
                      >
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: tech.color, boxShadow: `0 0 8px ${tech.color}80` }} />
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.8)" }}>{tech.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
};
export default Technology;
