import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Reveal, Stagger, StaggerChild } from "./AnimatedSection";

const projects = [
  { title: "NeuralCore AI Platform",  category: "AI / Machine Learning",  emoji: "🧠", color: "#FF6B00", gradient: "linear-gradient(135deg,#FF6B00,#FF3B30)", tags: ["Python","TensorFlow","React","AWS"],     metrics: ["10M+ Daily Requests","99.9% Uptime","40% Cost Reduction"],  desc: "Enterprise-grade AI platform processing 10M+ data points daily with real-time predictive analytics.",        service: "ai"       },
  { title: "CloudVault Enterprise",   category: "Cloud Infrastructure",    emoji: "☁️", color: "#1A8FFF", gradient: "linear-gradient(135deg,#1A8FFF,#0A6FD4)", tags: ["AWS","Kubernetes","Go","Terraform"],    metrics: ["500TB+ Data","99.99% SLA","60% Faster Deploy"],              desc: "Multi-cloud management platform serving Fortune 500 companies with automated scaling.",                      service: "cloud"    },
  { title: "FinTech Pro Suite",        category: "Enterprise Software",     emoji: "💹", color: "#10B981", gradient: "linear-gradient(135deg,#10B981,#059669)", tags: ["Next.js","Node.js","PostgreSQL","Redis"], metrics: ["$2B+ Transactions","150ms Response","SOC2 Certified"],       desc: "Comprehensive financial management platform with real-time trading analytics and risk assessment.",           service: "enterprise"},
  { title: "MediSync Health App",      category: "Mobile Application",      emoji: "🏥", color: "#0A6FD4", gradient: "linear-gradient(135deg,#0A6FD4,#1565C0)", tags: ["Flutter","Python","Firebase","ML Kit"],  metrics: ["500K+ Users","4.9★ Rating","HIPAA Compliant"],               desc: "AI-powered healthcare platform connecting 500K+ patients with doctors and real-time diagnostics.",            service: "mobile"   },
  { title: "RetailIQ Analytics",       category: "Business Intelligence",   emoji: "📊", color: "#F59E0B", gradient: "linear-gradient(135deg,#F59E0B,#D97706)", tags: ["React","Python","Spark","Tableau"],     metrics: ["200+ Stores","35% Revenue Lift","Real-time Insights"],       desc: "Real-time retail analytics platform with AI-driven demand forecasting and inventory optimization.",           service: "enterprise"},
  { title: "SmartCity Platform",       category: "IoT / Smart Systems",     emoji: "🏙️", color: "#FF3B30", gradient: "linear-gradient(135deg,#FF3B30,#FF6B00)", tags: ["IoT","React","Node.js","MongoDB"],      metrics: ["3 Cities","1M+ Sensors","25% Energy Saved"],                desc: "Integrated smart city management system handling traffic, utilities, and public services.",                   service: "enterprise"},
];

const scrollToContact = (service) => {
  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const select = document.querySelector('select[name="service"]');
    if (select && service) {
      select.value = service;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, 800);
};

export default function Projects() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="projects" className="section-padding" style={{ background: "#050A14", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(255,107,0,0.3),transparent)" }} />

      <div className="container">
        <Reveal dir="up" style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Our Work</div>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: "800", marginBottom: "16px" }}>
            Projects That{" "}
            <span style={{ background: "linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Define Excellence</span>
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7" }}>
            A showcase of transformative solutions built for industry leaders worldwide.
          </p>
        </Reveal>

        <Stagger stagger={0.08} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "18px" }}>
          {projects.map((p, i) => (
            <StaggerChild key={i} dir="zoom">
              <motion.div
                onHoverStart={() => setHovered(i)} onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -10 }}
                onClick={() => scrollToContact(p.service)}
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${hovered === i ? p.color + "45" : "rgba(255,255,255,0.07)"}`, borderRadius: "20px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.3s", height: "100%" }}>
                {/* header */}
                <div style={{ height: "150px", position: "relative", background: p.gradient, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 50%,rgba(255,255,255,0.08) 0%,transparent 60%)" }} />
                  <motion.div animate={hovered === i ? { scale: 1.18, rotate: 8 } : { scale: 1, rotate: 0 }} transition={{ duration: 0.35 }}
                    style={{ fontSize: "52px", position: "relative", zIndex: 1 }}>{p.emoji}</motion.div>
                  <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "100px", padding: "3px 10px", fontSize: "10px", fontWeight: "600", color: "rgba(255,255,255,0.9)" }}>{p.category}</div>
                  <motion.div animate={hovered === i ? { opacity: 1 } : { opacity: 0 }}
                    style={{ position: "absolute", top: "12px", right: "12px", width: "30px", height: "30px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    <ArrowUpRight size={15} />
                  </motion.div>
                </div>
                {/* body */}
                <div style={{ padding: "22px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px", color: "white" }}>{p.title}</h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "14px" }}>{p.desc}</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {p.metrics.map((m, j) => (
                      <span key={j} style={{ fontSize: "10px", fontWeight: "600", color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}25`, padding: "3px 8px", borderRadius: "100px" }}>{m}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {p.tags.map((tag, j) => (
                      <span key={j} style={{ fontSize: "10px", color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: "5px" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </Stagger>

        <Reveal dir="up" delay={0.2} style={{ textAlign: "center", marginTop: "48px" }}>
          <motion.button onClick={() => scrollToContact()} whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(255,107,0,0.25)" }} whileTap={{ scale: 0.97 }}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,0,0.3)", color: "#FF6B00", padding: "12px 28px", borderRadius: "11px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "7px" }}>
            Discuss a Similar Project <ExternalLink size={14} />
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}
