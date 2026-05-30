import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Eye, Zap, Globe } from "lucide-react";
import { Reveal, Stagger, StaggerChild, EASE } from "./AnimatedSection";

const stats = [
  { value: 2026, suffix: "",   label: "Year Founded", icon: Zap    },
  { value: 100,  suffix: "%",  label: "Commitment",   icon: Target },
  { value: 24,   suffix: "/7", label: "Support",      icon: Globe  },
  { value: 1,    suffix: "st", label: "Of Its Kind",  icon: Eye    },
];

const timeline = [
  { year: "2026 Jan", title: "The Idea",           desc: "Sanjiv Raaj R conceived the vision for Guhanix — a technology company built differently, from the ground up." },
  { year: "2026 Feb", title: "Company Founded",    desc: "Guhanix Technologies officially launched with a bold mission to engineer the future through intelligent technology." },
  { year: "2026 Mar", title: "First Product",      desc: "Began development of our first AI-powered product suite, setting the foundation for our technology stack." },
  { year: "2026 Now", title: "Building & Growing", desc: "Actively onboarding clients, building our team, and delivering world-class solutions from day one." },
  { year: "2026 Q3",  title: "Expansion Plans",    desc: "Scaling our AI division, cloud infrastructure, and mobile development capabilities to serve global clients." },
  { year: "Future",   title: "Global Impact",      desc: "The journey to becoming a globally recognized technology powerhouse has just begun." },
];

function Counter({ value, suffix }) {
  const [n, setN] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export default function About() {
  return (
    <section id="about" className="section-padding" style={{ background: "#050505", position: "relative", overflow: "hidden" }}>
      {/* bg glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle,rgba(255,107,0,0.04) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div className="container">

        {/* Header */}
        <Reveal dir="up" style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Our Story</div>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: "800", marginBottom: "16px" }}>
            Built to{" "}
            <span style={{ background: "linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Redefine</span>
            {" "}Technology
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "560px", margin: "0 auto", lineHeight: "1.7" }}>
            A bold new startup founded in 2026 — built to transform ambitious ideas into world-class digital products from day one.
          </p>
        </Reveal>

        {/* Stats */}
        <Stagger stagger={0.09} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "18px", marginBottom: "80px" }}>
          {stats.map((s, i) => (
            <StaggerChild key={i} dir="up">
              <motion.div whileHover={{ y: -6, borderColor: "rgba(255,107,0,0.3)" }}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "28px 20px", textAlign: "center", transition: "all 0.3s", backdropFilter: "blur(10px)" }}>
                <div style={{ width: "42px", height: "42px", background: "rgba(255,107,0,0.1)", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <s.icon size={19} color="#FF6B00" />
                </div>
                <div style={{ fontSize: "38px", fontWeight: "800", fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "7px" }}>{s.label}</div>
              </motion.div>
            </StaggerChild>
          ))}
        </Stagger>

        {/* Mission & Vision */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "18px", marginBottom: "80px" }}>
          {[
            { icon: Target, title: "Our Mission", color: "#FF6B00", dir: "left",
              text: "To empower organizations worldwide with cutting-edge technology solutions that drive measurable growth, operational excellence, and competitive advantage." },
            { icon: Eye, title: "Our Vision", color: "#00BFFF", dir: "right",
              text: "To be the most trusted technology partner for enterprises globally — known for innovation, reliability, and transformative impact that shapes the future." },
          ].map((item, i) => (
            <Reveal key={i} dir={item.dir} delay={i * 0.1}>
              <motion.div whileHover={{ y: -5 }}
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(${i === 0 ? "255,107,0" : "0,191,255"},0.15)`, borderRadius: "20px", padding: "32px", transition: "all 0.3s", height: "100%" }}>
                <div style={{ width: "48px", height: "48px", background: `rgba(${i === 0 ? "255,107,0" : "0,191,255"},0.1)`, borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                  <item.icon size={22} color={item.color} />
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "12px", color: item.color }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: "1.8" }}>{item.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Timeline */}
        <Reveal dir="up" delay={0.1} style={{ marginBottom: "0" }}>
          <h3 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", marginBottom: "48px" }}>Our Journey</h3>
          <div style={{ position: "relative" }}>
            <div className="tl-line" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom,transparent,rgba(255,107,0,0.35),transparent)", transform: "translateX(-50%)" }} />
            {timeline.map((item, i) => (
              <Reveal key={i} dir={i % 2 === 0 ? "left" : "right"} delay={i * 0.06}
                className="tl-row"
                style={{ display: "flex", justifyContent: i % 2 === 0 ? "flex-start" : "flex-end", marginBottom: "28px", position: "relative" }}>
                <div className="tl-dot" style={{ position: "absolute", left: "50%", top: "18px", transform: "translateX(-50%)", width: "10px", height: "10px", borderRadius: "50%", background: "linear-gradient(135deg,#FF6B00,#FF3B30)", boxShadow: "0 0 10px rgba(255,107,0,0.6)", zIndex: 1 }} />
                <motion.div whileHover={{ y: -3 }} className="tl-card"
                  style={{ width: "44%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px 20px", backdropFilter: "blur(10px)", transition: "all 0.3s" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#FF6B00", letterSpacing: "0.1em", marginBottom: "5px" }}>{item.year}</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "5px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>{item.desc}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>

      <style>{`
        @media(max-width:768px){
          .tl-line,.tl-dot{display:none!important}
          .tl-row{justify-content:flex-start!important}
          .tl-card{width:100%!important}
        }
      `}</style>
    </section>
  );
}
