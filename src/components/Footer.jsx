import { motion } from 'framer-motion';
import { Link, Share2, ExternalLink, AtSign, Hash, ArrowUpRight, Mail } from 'lucide-react';

const footerLinks = {
  Services: ['AI Development', 'Web Development', 'Mobile Apps', 'Cloud Solutions', 'Enterprise Software', 'UI/UX Design'],
  Company: ['About Us', 'Our Team', 'Careers', 'Press Kit', 'Blog', 'Contact'],
  Resources: ['Case Studies', 'Documentation', 'API Reference', 'Status Page', 'Privacy Policy', 'Terms of Service'],
};

const socials = [
  { icon: Link, href: '#', label: 'LinkedIn', color: '#0077B5' },
  { icon: Share2, href: '#', label: 'Twitter', color: '#1DA1F2' },
  { icon: ExternalLink, href: '#', label: 'GitHub', color: '#ffffff' },
  { icon: AtSign, href: '#', label: 'Instagram', color: '#E1306C' },
  { icon: Hash, href: '#', label: 'YouTube', color: '#FF0000' },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{
      background: '#030303',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '200px',
        background: 'radial-gradient(ellipse, rgba(255,107,0,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Newsletter Banner */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 0'
      }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '24px'
          }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
                Stay ahead of the curve
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                Get the latest insights on AI, technology, and digital transformation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="rgba(255,255,255,0.3)" style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)'
                }} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '12px 16px 12px 40px',
                    color: 'white', fontSize: '14px', outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                    width: '260px'
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(255,107,0,0.4)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
                  color: 'white', border: 'none',
                  padding: '12px 24px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container" style={{ padding: '80px 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr repeat(3, 1fr)',
          gap: '60px', marginBottom: '60px'
        }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', cursor: 'pointer' }}
              onClick={scrollToTop}
            >
              <div style={{
                width: '42px', height: '42px',
                background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: '900',
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'white',
                boxShadow: '0 0 20px rgba(255,107,0,0.3)'
              }}>
                G
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif", color: 'white' }}>
                  Guhanix
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,107,0,0.8)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Technologies
                </div>
              </div>
            </motion.div>

            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', marginBottom: '28px', maxWidth: '280px' }}>
              Engineering the future through intelligent technology. Premium solutions for forward-thinking enterprises worldwide.
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {socials.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.15, y: -3, color: social.color }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s'
                  }}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{
                fontSize: '12px', fontWeight: '700',
                color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em',
                textTransform: 'uppercase', marginBottom: '20px'
              }}>
                {category}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map((link, i) => (
                  <li key={i}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4, color: '#FF6B00' }}
                      style={{
                        fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none', transition: 'all 0.2s',
                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            © 2024 Guhanix Technologies. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ color: '#FF6B00' }}
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,107,0,0.4)' }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,107,0,0.1)',
              border: '1px solid rgba(255,107,0,0.25)',
              color: '#FF6B00', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700'
            }}
          >
            ↑
          </motion.button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
