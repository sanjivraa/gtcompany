import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About',      href: '#about'      },
  { label: 'Services',   href: '#services'   },
  { label: 'Work',       href: '#projects'   },
  { label: 'Technology', href: '#technology' },
  { label: 'Reviews',    href: '#reviews'    },
  { label: 'Contact',    href: '#contact'    },
];

// IDs to watch for active scroll-spy
const SECTION_IDS = navLinks.map(l => l.href.slice(1));

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [active,    setActive]    = useState('');
  const [hidden,    setHidden]    = useState(false);
  const [lastY,     setLastY]     = useState(0);

  const { scrollY } = useScroll();

  /* ── Hide on scroll down, show on scroll up ── */
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40);
    if (y > lastY + 8 && y > 120)  setHidden(true);
    if (y < lastY - 8)             setHidden(false);
    setLastY(y);
  });

  /* ── Scroll-spy ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const handleNavClick = useCallback((href) => {
    setMenuOpen(false);
    const id = href.slice(1);
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -80 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: scrolled ? '10px 0' : '18px 0',
          transition: 'padding 0.3s ease',
        }}
      >
        {/* Frosted glass background */}
        <motion.div
          animate={{
            opacity: scrolled ? 1 : 0,
            backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(0px)',
          }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(5,10,20,0.82)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        />

        {/* Gradient line at bottom on scroll */}
        <motion.div
          animate={{ opacity: scrolled ? 1 : 0, scaleX: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,0,0.4) 30%, rgba(26,143,255,0.3) 70%, transparent 100%)',
            transformOrigin: 'left',
          }}
        />

        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>

          {/* Brand */}
          <motion.a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setActive(''); }}
            whileHover={{ scale: 1.02 }}
            style={{ display: 'flex', alignItems: 'center', gap: '11px', textDecoration: 'none' }}
          >
            <motion.div
              animate={{ boxShadow: ['0 0 14px rgba(255,107,0,0.3)', '0 0 24px rgba(26,143,255,0.4)', '0 0 14px rgba(255,107,0,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                background: 'linear-gradient(135deg, #0D1626 0%, #050A14 100%)',
                border: '1px solid rgba(255,107,0,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: '900', fontFamily: "'Space Grotesk',sans-serif", background: 'linear-gradient(135deg,#FF6B00,#1A8FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-1px', position: 'relative', zIndex: 1 }}>G</span>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'rgba(255,255,255,0.05)', borderRadius: '9px 9px 0 0' }} />
            </motion.div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1, letterSpacing: '-0.01em' }}>
                <span style={{ color: '#1A8FFF' }}>GUHA</span><span style={{ color: '#FF6B00' }}>NIX</span>
              </div>
              <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '2px' }}>
                TECHNOLOGY
              </div>
            </div>
          </motion.a>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  whileHover={{ color: '#FF6B00' }}
                  style={{
                    background: isActive ? 'rgba(255,107,0,0.08)' : 'none',
                    border: 'none',
                    color: isActive ? '#FF6B00' : 'rgba(255,255,255,0.65)',
                    fontSize: '13.5px', fontWeight: isActive ? '600' : '500',
                    padding: '8px 15px', borderRadius: '8px',
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: "'Inter',sans-serif",
                    position: 'relative',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      style={{
                        position: 'absolute', bottom: '3px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '18px', height: '2px',
                        borderRadius: '2px',
                        background: 'linear-gradient(90deg, #FF6B00, #1A8FFF)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* CTA + Mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.button
              onClick={() => handleNavClick('#contact')}
              whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(255,107,0,0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="desktop-nav"
              style={{
                background: 'linear-gradient(135deg,#FF6B00,#FF3B30)',
                color: 'white', border: 'none',
                padding: '9px 20px', borderRadius: '9px',
                fontSize: '13px', fontWeight: '700',
                cursor: 'pointer', letterSpacing: '0.02em',
                boxShadow: '0 0 20px rgba(255,107,0,0.25)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Get Started</span>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.08)' }} />
            </motion.button>

            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.88 }}
              className="mobile-menu-btn"
              style={{
                background: menuOpen ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${menuOpen ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: menuOpen ? '#FF6B00' : 'white',
                padding: '8px', borderRadius: '8px', cursor: 'pointer',
                display: 'none', transition: 'all 0.2s',
              }}
            >
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, y: 0,  clipPath: 'inset(0 0 0% 0)'   }}
            exit={{   opacity: 0, y: -8,  clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: '64px', left: '12px', right: '12px',
              zIndex: 999,
              background: 'rgba(7,16,31,0.96)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: '12px 8px 20px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Top gradient line */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.4), rgba(26,143,255,0.3), transparent)', margin: '0 12px 12px' }} />

            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => handleNavClick(link.href)}
                style={{
                  display: 'flex', width: '100%', textAlign: 'left',
                  alignItems: 'center', justifyContent: 'space-between',
                  background: active === link.href.slice(1) ? 'rgba(255,107,0,0.07)' : 'none',
                  border: 'none',
                  color: active === link.href.slice(1) ? '#FF6B00' : 'rgba(255,255,255,0.8)',
                  fontSize: '16px', fontWeight: '500',
                  padding: '13px 16px', borderRadius: '10px',
                  cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                {link.label}
                {active === link.href.slice(1) && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF6B00' }} />}
              </motion.button>
            ))}

            <div style={{ margin: '12px 8px 0', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              onClick={() => handleNavClick('#contact')}
              style={{
                marginTop: '12px', width: '100%',
                background: 'linear-gradient(135deg,#FF6B00,#FF3B30)',
                color: 'white', border: 'none',
                padding: '14px', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Get Started →</span>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.08)' }} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
