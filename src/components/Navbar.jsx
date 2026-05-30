import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Technology', href: '#technology' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setActiveLink(href);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: scrolled ? '12px 0' : '20px 0',
          background: scrolled
            ? 'rgba(5,5,5,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            whileHover={{ scale: 1.02 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          >
            <motion.div
              animate={{ boxShadow: ['0 0 20px rgba(255,107,0,0.3)', '0 0 40px rgba(255,107,0,0.6)', '0 0 20px rgba(255,107,0,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '38px', height: '38px',
                background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: '900',
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'white', letterSpacing: '-1px'
              }}
            >
              G
            </motion.div>
            <div>
              <div style={{
                fontSize: '16px', fontWeight: '700',
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'white', letterSpacing: '-0.02em',
                lineHeight: 1
              }}>
                Guhanix
              </div>
              <div style={{
                fontSize: '9px', fontWeight: '500',
                color: 'rgba(255,107,0,0.8)', letterSpacing: '0.2em',
                textTransform: 'uppercase', lineHeight: 1, marginTop: '2px'
              }}>
                Technologies
              </div>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
            {navLinks.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                whileHover={{ color: '#FF6B00' }}
                style={{
                  background: 'none', border: 'none',
                  color: activeLink === link.href ? '#FF6B00' : 'rgba(255,255,255,0.7)',
                  fontSize: '14px', fontWeight: '500',
                  padding: '8px 16px', borderRadius: '8px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: "'Inter', sans-serif",
                  position: 'relative'
                }}
              >
                {link.label}
                {activeLink === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    style={{
                      position: 'absolute', bottom: '4px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px', height: '4px',
                      borderRadius: '50%',
                      background: '#FF6B00'
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* CTA Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.button
              onClick={() => handleNavClick('#contact')}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,107,0,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="desktop-nav"
              style={{
                background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
                color: 'white', border: 'none',
                padding: '10px 22px', borderRadius: '10px',
                fontSize: '13px', fontWeight: '600',
                cursor: 'pointer', letterSpacing: '0.02em'
              }}
            >
              Get Started
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }}
              className="mobile-menu-btn"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', padding: '8px',
                borderRadius: '8px', cursor: 'pointer',
                display: 'none'
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', top: '70px', left: 0, right: 0,
              zIndex: 999,
              background: 'rgba(5,5,5,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '20px 24px 30px'
            }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleNavClick(link.href)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '18px', fontWeight: '500',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => handleNavClick('#contact')}
              style={{
                marginTop: '20px', width: '100%',
                background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
                color: 'white', border: 'none',
                padding: '14px', borderRadius: '12px',
                fontSize: '15px', fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Get Started
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
