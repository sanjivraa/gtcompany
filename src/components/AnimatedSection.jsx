import { useRef } from "react";
import {
  motion, useInView, useScroll, useTransform, useSpring
} from "framer-motion";

/* ─── Premium easing curves ─── */
export const EASE         = [0.22, 1, 0.36, 1];         // expo out
export const EASE_BACK    = [0.34, 1.56, 0.64, 1];      // spring overshoot
export const EASE_SMOOTH  = [0.4, 0, 0.2, 1];           // material-like

/* ══════════════════════════════════════════
   REVEAL  — single element entrance
   Supports: up | down | left | right | zoom | zoomUp | fade | blur | flip
══════════════════════════════════════════ */
export function Reveal({
  children,
  dir       = "up",
  delay     = 0,
  duration  = 0.65,
  distance  = 40,
  style,
  className,
  once      = true,
}) {
  const ref    = useRef();
  const inView = useInView(ref, { once, margin: "-60px" });

  const variants = {
    up:      { hidden: { opacity: 0, y: distance, filter: "blur(4px)" },      visible: { opacity: 1, y: 0,     filter: "blur(0px)" } },
    down:    { hidden: { opacity: 0, y: -distance, filter: "blur(4px)" },     visible: { opacity: 1, y: 0,     filter: "blur(0px)" } },
    left:    { hidden: { opacity: 0, x: -distance, filter: "blur(4px)" },     visible: { opacity: 1, x: 0,     filter: "blur(0px)" } },
    right:   { hidden: { opacity: 0, x: distance,  filter: "blur(4px)" },     visible: { opacity: 1, x: 0,     filter: "blur(0px)" } },
    zoom:    { hidden: { opacity: 0, scale: 0.86, filter: "blur(6px)" },       visible: { opacity: 1, scale: 1, filter: "blur(0px)" } },
    zoomUp:  { hidden: { opacity: 0, scale: 0.9, y: 24, filter: "blur(4px)" },visible: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } },
    fade:    { hidden: { opacity: 0 },                                          visible: { opacity: 1 } },
    blur:    { hidden: { opacity: 0, filter: "blur(12px)" },                   visible: { opacity: 1, filter: "blur(0px)" } },
    flip:    { hidden: { opacity: 0, rotateX: 22, y: 30 },                     visible: { opacity: 1, rotateX: 0, y: 0 } },
    slideUp: { hidden: { opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" },   visible: { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" } },
  };

  const v = variants[dir] ?? variants.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={v}
      transition={{
        duration,
        delay,
        ease: EASE,
        filter: { duration: duration * 0.8 },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   STAGGER  — parent that staggers children
══════════════════════════════════════════ */
export function Stagger({
  children,
  stagger      = 0.07,
  delay        = 0,
  initialDelay = 0,
  style,
  className,
}) {
  const ref    = useRef();
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay + initialDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   STAGGER CHILD  — item inside Stagger
══════════════════════════════════════════ */
export function StaggerChild({ children, dir = "up", style, className }) {
  const variants = {
    up:    {
      hidden:  { opacity: 0, y: 36, filter: "blur(4px)" },
      visible: { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
    },
    left:  {
      hidden:  { opacity: 0, x: -36, filter: "blur(4px)" },
      visible: { opacity: 1, x: 0,   filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
    },
    right: {
      hidden:  { opacity: 0, x: 36,  filter: "blur(4px)" },
      visible: { opacity: 1, x: 0,   filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
    },
    zoom:  {
      hidden:  { opacity: 0, scale: 0.84, filter: "blur(6px)" },
      visible: { opacity: 1, scale: 1,    filter: "blur(0px)", transition: { duration: 0.5, ease: EASE_BACK } },
    },
    flip:  {
      hidden:  { opacity: 0, rotateX: 20, y: 20 },
      visible: { opacity: 1, rotateX: 0,  y: 0,  transition: { duration: 0.5, ease: EASE } },
    },
    fade:  {
      hidden:  { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={variants[dir] ?? variants.up}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   PARALLAX  — subtle vertical parallax on scroll
   Usage: <Parallax speed={0.15}> ... </Parallax>
   speed: 0 = no movement, 0.2 = moderate, 0.4 = strong
══════════════════════════════════════════ */
export function Parallax({ children, speed = 0.12, style, className }) {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [-speed * 120, speed * 120]);
  const y    = useSpring(rawY, { stiffness: 80, damping: 30 });

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAGNETIC  — element follows cursor slightly
   Usage: <Magnetic> <button>...</button> </Magnetic>
══════════════════════════════════════════ */
export function Magnetic({ children, strength = 0.35, style, className }) {
  const ref = useRef();
  const x   = useSpring(0, { stiffness: 200, damping: 20 });
  const y   = useSpring(0, { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    if (!ref.current) return;
    const rect  = ref.current.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, x, y, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   TEXT REVEAL  — word-by-word or char-by-char
   Usage: <TextReveal text="Hello World" by="word" />
══════════════════════════════════════════ */
export function TextReveal({
  text,
  by       = "word",
  delay    = 0,
  duration = 0.5,
  style,
  className,
  as       = "span",
}) {
  const ref    = useRef();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Tag    = motion[as] ?? motion.span;
  const parts  = by === "char" ? text.split("") : text.split(" ");

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap", gap: by === "char" ? "0" : "0.25em", ...style }}
    >
      {parts.map((part, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration, delay: delay + i * (by === "char" ? 0.03 : 0.06), ease: EASE }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {part}{by === "word" && i < parts.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ── Legacy aliases so existing imports still work ── */
export const AnimatedSection  = Reveal;
export const SlideCard        = Reveal;
export const SlideHeading     = Reveal;
export const SlideGrid        = Stagger;
export const SlideItem        = StaggerChild;
export const StaggerContainer = Stagger;
export const StaggerItem      = StaggerChild;
export default Reveal;
