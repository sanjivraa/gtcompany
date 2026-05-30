import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

/* Slide a single element in when it enters viewport */
export function Reveal({ children, dir = "up", delay = 0, duration = 0.55, style, className }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const variants = {
    up:    { hidden: { opacity: 0, y: 48 },   visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -36 },  visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -52 },  visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 52 },   visible: { opacity: 1, x: 0 } },
    zoom:  { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
    fade:  { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[dir] || variants.up}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Stagger children — wrap a grid/list */
export function Stagger({ children, stagger = 0.08, delay = 0, style, className }) {
  const ref = useRef();
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
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* Child of Stagger */
export function StaggerChild({ children, dir = "up", style, className }) {
  const v = {
    up:    { hidden: { opacity: 0, y: 44 },   visible: { opacity: 1, y: 0,   transition: { duration: 0.5, ease: EASE } } },
    left:  { hidden: { opacity: 0, x: -44 },  visible: { opacity: 1, x: 0,   transition: { duration: 0.5, ease: EASE } } },
    right: { hidden: { opacity: 0, x: 44 },   visible: { opacity: 1, x: 0,   transition: { duration: 0.5, ease: EASE } } },
    zoom:  { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } } },
    fade:  { hidden: { opacity: 0 },           visible: { opacity: 1,         transition: { duration: 0.4, ease: EASE } } },
  };
  return (
    <motion.div className={className} style={style} variants={v[dir] || v.up}>
      {children}
    </motion.div>
  );
}

/* Legacy aliases so existing imports still work */
export const AnimatedSection  = Reveal;
export const SlideCard        = Reveal;
export const SlideHeading     = Reveal;
export const SlideGrid        = Stagger;
export const SlideItem        = StaggerChild;
export const StaggerContainer = Stagger;
export const StaggerItem      = StaggerChild;
export default Reveal;
