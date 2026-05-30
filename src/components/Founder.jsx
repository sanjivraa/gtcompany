import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link, ExternalLink, Share2, Rocket, Code2, Lightbulb, Target } from "lucide-react";
import { Reveal, Stagger, StaggerChild, EASE } from "./AnimatedSection";

const achievements = [
  { icon: Rocket,    label: "Company Founded", value: "2026"       },
  { icon: Code2,     label: "Tech Expertise",  value: "Full Stack" },
  { icon: Lightbulb, label: "Vision",          value: "AI-First"   },
  { icon: Target,    label: "Mission",         value: "Global"     },
];

export default function Founder() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="founder" ref={ref} className="section-padding"
      style={{ background: "linear-gradient(180deg,#050505 0%,#080808 50%,#050505 100%)", position: "relative", overflow: "hidden" }}>

      {/* bg glow */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }}
        style={{ position: "absolute", top: "30%", right: "-15%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,107,0,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div className="container">

        {/* Header */}
        <Reveal dir="up" style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Leadership</div>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: "800" }}>
            Meet the{" "}
            <span style={{ background: "linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Visionary Founder</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "60px", alignItems: "center" }}>

          {/* Card — slides from left */}
          <Reveal dir="left" delay={0.1} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "320px" }}>
              {/* rotating border */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", inset: "-2px", borderRadius: "26px", background: "conic-gradient(from 0deg,#FF6B00,#FF3B30,#7C3AED,#00BFFF,#FF6B00)", zIndex: 0, opacity: 0.65 }} />
              <div style={{ position: "relative", zIndex: 1, background: "rgba(8,8,12,0.96)", borderRadius: "24px", padding: "36px", backdropFilter: "blur(20px)", textAlign: "center" }}>

                {/* Avatar */}
                <div style={{ position: "relative", width: "110px", height: "110px", margin: "0 auto 20px" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    style={{ position: "absolute", inset: "-3px", borderRadius: "50%", background: "conic-gradient(from 0deg,#FF6B00,#FF3B30,#00BFFF,#FF6B00)", opacity: 0.8 }} />
                  <div style={{ position: "relative", zIndex: 1, width: "110px", height: "110px", borderRadius: "50%", background: "linear-gradient(135deg,#1a0800,#080818)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "900", fontFamily: "'Space Grotesk',sans-serif", color: "white", overflow: "hidden" }}>
                    SR
                    <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                      style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)", transform: "skewX(-20deg)" }} />
                  </div>
                </div>

                <h3 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "4px", fontFamily: "'Space Grotesk',sans-serif", color: "white" }}>Sanjiv Raaj R</h3>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#FF6B00", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Founder & CEO</div>

                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.25)", borderRadius: "100px", padding: "4px 12px", fontSize: "11px", fontWeight: "600", color: "#FF6B00", marginBottom: "18px" }}>
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#FF6B00" }} />
                  🚀 Startup · Est. 2026
                </div>

                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "22px" }}>
                  Visionary technologist building the next generation of intelligent technology solutions from the ground up.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  {[
                    { icon: Link,         color: "#0077B5", label: "LinkedIn" },
                    { icon: Share2,       color: "#1DA1F2", label: "Twitter"  },
                    { icon: ExternalLink, color: "#ffffff", label: "GitHub"   },
                  ].map((s, i) => (
                    <motion.a key={i} href="#" aria-label={s.label}
                      whileHover={{ scale: 1.2, y: -3 }} whileTap={{ scale: 0.9 }}
                      style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                      <s.icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bio — slides from right */}
          <Reveal dir="right" delay={0.15}>
            <div className="section-label">CEO Spotlight</div>
            <h3 style={{ fontSize: "clamp(22px,3vw,38px)", fontWeight: "800", marginBottom: "18px", lineHeight: "1.2" }}>
              Building Tomorrow&apos;s{" "}
              <span style={{ background: "linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Technology</span>
              {" "}Today
            </h3>

            <div style={{ background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: "14px", padding: "16px 20px", marginBottom: "18px" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#FF6B00", letterSpacing: "0.1em", marginBottom: "6px" }}>🚀 THE ORIGIN STORY</div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.7", margin: 0 }}>
                Guhanix Technologies was born in 2026 with a bold vision — to build world-class technology accessible to every ambitious organization.
              </p>
            </div>

            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", marginBottom: "12px" }}>
              Sanjiv Raaj R founded Guhanix with a singular mission: to engineer intelligent, scalable, and beautiful technology that transforms how businesses operate.
            </p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", marginBottom: "28px" }}>
              With deep expertise in AI, full-stack development, and product design, Sanjiv leads Guhanix from day one — building a culture obsessed with quality, innovation, and impact.
            </p>

            {/* Achievement cards */}
            <Stagger stagger={0.08} style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "12px" }}>
              {achievements.map((item, i) => (
                <StaggerChild key={i} dir="up">
                  <motion.div whileHover={{ y: -4, borderColor: "rgba(255,107,0,0.35)" }}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "13px", padding: "16px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.3s" }}>
                    <div style={{ width: "38px", height: "38px", flexShrink: 0, background: "rgba(255,107,0,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <item.icon size={17} color="#FF6B00" />
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "white", fontFamily: "'Space Grotesk',sans-serif" }}>{item.value}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>{item.label}</div>
                    </div>
                  </motion.div>
                </StaggerChild>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
