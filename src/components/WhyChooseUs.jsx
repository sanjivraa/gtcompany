import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, Zap, Users, Trophy, Clock, HeartHandshake, TrendingUp, Brain } from "lucide-react";
import { Reveal, Stagger, StaggerChild } from "./AnimatedSection";

const features = [
  { icon: Brain,          title: "AI-First Approach",    color: "#FF6B00", stat: "10x",    statLabel: "Faster Delivery",  desc: "Every solution we build is infused with intelligent automation and machine learning from the ground up." },
  { icon: ShieldCheck,    title: "Enterprise Security",   color: "#00BFFF", stat: "100%",   statLabel: "Compliance Rate",  desc: "Bank-grade security protocols, SOC2 compliance, and zero-trust architecture protecting your assets." },
  { icon: Zap,            title: "Lightning Performance", color: "#F59E0B", stat: "99.99%", statLabel: "Uptime SLA",       desc: "Sub-100ms response times, 99.99% uptime SLAs, and globally distributed infrastructure." },
  { icon: Users,          title: "Dedicated Teams",       color: "#10B981", stat: "80+",    statLabel: "Expert Engineers", desc: "Senior engineers, designers, and strategists fully embedded in your project — not outsourced." },
  { icon: Trophy,         title: "Proven Excellence",     color: "#7C3AED", stat: "12+",    statLabel: "Industry Awards",  desc: "Award-winning solutions recognized by industry leaders, delivering beyond expectations." },
  { icon: Clock,          title: "On-Time Delivery",      color: "#FF3B30", stat: "98%",    statLabel: "On-Time Rate",     desc: "Agile methodology with transparent milestones ensures your project ships on schedule." },
  { icon: HeartHandshake, title: "Long-Term Partnership", color: "#EC4899", stat: "95%",    statLabel: "Client Retention", desc: "We do not just build and leave. Our support teams ensure your solution evolves with your business." },
  { icon: TrendingUp,     title: "Measurable ROI",        color: "#14B8A6", stat: "300%",   statLabel: "Avg. ROI",         desc: "Data-driven approach with clear KPIs and ROI tracking so you always know the business impact." },
];

function TiltCard({ children }) {
  const ref = useRef();
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 280, damping: 28 });
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900, height: "100%" }}>
      {children}
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="why-us" className="section-padding"
      style={{ background: "linear-gradient(180deg,#050505 0%,#080808 50%,#050505 100%)", position: "relative", overflow: "hidden" }}>

      {/* subtle grid bg */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,107,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,0,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal dir="up" style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Why Guhanix</div>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,54px)", fontWeight: "800", marginBottom: "16px", lineHeight: 1.1 }}>
            The Standard Others{" "}
            <span style={{ background: "linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Aspire To</span>
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "520px", margin: "0 auto", lineHeight: "1.7" }}>
            We do not just meet expectations — we redefine them.
          </p>
        </Reveal>

        <Stagger stagger={0.07} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "16px" }}>
          {features.map((f, i) => (
            <StaggerChild key={i} dir="up">
              <TiltCard>
                <motion.div
                  onHoverStart={() => setHovered(i)} onHoverEnd={() => setHovered(null)}
                  animate={hovered === i
                    ? { borderColor: `${f.color}45`, background: `${f.color}06` }
                    : { borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
                  transition={{ duration: 0.25 }}
                  style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "26px", height: "100%", position: "relative", overflow: "hidden", backdropFilter: "blur(10px)" }}>
                  {/* top accent line */}
                  <motion.div animate={hovered === i ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.25 }}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${f.color},transparent)` }} />
                  {/* stat */}
                  <div style={{ position: "absolute", top: "16px", right: "16px", textAlign: "right" }}>
                    <div style={{ fontSize: "15px", fontWeight: "800", color: f.color, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{f.stat}</div>
                    <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.28)", marginTop: "2px" }}>{f.statLabel}</div>
                  </div>
                  {/* icon */}
                  <motion.div animate={hovered === i ? { scale: 1.08, rotate: 4 } : { scale: 1, rotate: 0 }} transition={{ duration: 0.25 }}
                    style={{ width: "46px", height: "46px", background: `${f.color}14`, border: `1px solid ${f.color}28`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    <f.icon size={21} color={f.color} />
                  </motion.div>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: "white" }}>{f.title}</h3>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.48)", lineHeight: "1.7" }}>{f.desc}</p>
                </motion.div>
              </TiltCard>
            </StaggerChild>
          ))}
        </Stagger>

        {/* CTA bar */}
        <Reveal dir="up" delay={0.2} style={{ marginTop: "60px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "26px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "18px" }}>
            <div>
              <div style={{ fontSize: "17px", fontWeight: "700", marginBottom: "4px" }}>Ready to build something extraordinary?</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Join enterprises that trust Guhanix with their most critical technology.</div>
            </div>
            <motion.button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(255,107,0,0.45)" }} whileTap={{ scale: 0.97 }}
              style={{ background: "linear-gradient(135deg,#FF6B00,#FF3B30)", color: "white", border: "none", padding: "12px 26px", borderRadius: "11px", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
              Start Your Project →
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
