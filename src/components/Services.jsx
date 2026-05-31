import { motion } from "framer-motion";
import { Brain, Globe, Smartphone, Cloud, Server, Palette, ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerChild } from "./AnimatedSection";

const services = [
  { icon: Brain,      title: "AI Development",        color: "#FF6B00", bg: "rgba(255,107,0,0.08)",  border: "rgba(255,107,0,0.18)",  tags: ["Machine Learning","NLP","Computer Vision","AutoML"],
    desc: "Custom AI/ML models, NLP systems, computer vision, and intelligent automation that transform your business operations." },
  { icon: Globe,      title: "Web Development",        color: "#1A8FFF", bg: "rgba(26,143,255,0.07)",  border: "rgba(26,143,255,0.18)",  tags: ["React","Next.js","Node.js","TypeScript"],
    desc: "High-performance web applications built with cutting-edge frameworks, optimized for speed, SEO, and exceptional UX." },
  { icon: Smartphone, title: "Mobile App Development", color: "#FF3B30", bg: "rgba(255,59,48,0.08)",  border: "rgba(255,59,48,0.18)",  tags: ["Flutter","React Native","Kotlin","Swift"],
    desc: "Native and cross-platform mobile applications for iOS and Android with stunning UI and seamless performance." },
  { icon: Cloud,      title: "Cloud Solutions",        color: "#0A6FD4", bg: "rgba(10,111,212,0.08)", border: "rgba(10,111,212,0.18)", tags: ["AWS","Azure","GCP","DevOps"],
    desc: "Scalable cloud architecture, migration strategies, and managed services on AWS, Azure, and Google Cloud." },
  { icon: Server,     title: "Enterprise Software",    color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.18)", tags: ["ERP","CRM","BI","Microservices"],
    desc: "Custom ERP, CRM, and business intelligence platforms engineered for enterprise-scale operations and growth." },
  { icon: Palette,    title: "UI/UX Design",           color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)", tags: ["Figma","Design Systems","Prototyping","Research"],
    desc: "Premium design systems, user research, and pixel-perfect interfaces that convert visitors into loyal customers." },
];

export default function Services() {
  return (
    <section id="services" className="section-padding" style={{ background: "#050A14", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(255,107,0,0.3),transparent)" }} />

      <div className="container">
        <Reveal dir="up" style={{ textAlign: "center", marginBottom: "72px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>What We Do</div>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: "800", marginBottom: "16px" }}>
            Services That{" "}
            <span style={{ background: "linear-gradient(135deg,#FF6B00,#FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Drive Results</span>
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7" }}>
            End-to-end technology solutions engineered for performance, scalability, and measurable business impact.
          </p>
        </Reveal>

        <Stagger stagger={0.08} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "18px" }}>
          {services.map((s, i) => (
            <StaggerChild key={i} dir="up">
              <motion.div whileHover={{ y: -8, borderColor: s.border.replace("0.18", "0.4") }}
                style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "20px", padding: "28px", cursor: "default", position: "relative", overflow: "hidden", transition: "all 0.3s", backdropFilter: "blur(8px)", height: "100%" }}>
                <motion.div whileHover={{ rotate: 8, scale: 1.08 }}
                  style={{ width: "52px", height: "52px", background: `${s.color}18`, border: `1px solid ${s.color}30`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                  <s.icon size={24} color={s.color} />
                </motion.div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "10px", color: "white" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: "1.7", marginBottom: "18px" }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
                  {s.tags.map((tag, j) => (
                    <span key={j} style={{ fontSize: "10px", fontWeight: "600", color: s.color, background: `${s.color}12`, border: `1px solid ${s.color}25`, padding: "3px 9px", borderRadius: "100px" }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: s.color, fontSize: "12px", fontWeight: "600" }}>
                  Learn More <ArrowUpRight size={13} />
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
