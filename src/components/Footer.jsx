import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Github, Instagram, Youtube, ArrowUpRight, Mail, CheckCircle, X } from 'lucide-react';

// ── Update these with real URLs ──────────────────────────────────────────────
const SOCIAL_LINKS = {
  LinkedIn:  'https://linkedin.com/company/guhanix-technologies',
  Twitter:   'https://twitter.com/guhanixtech',
  GitHub:    'https://github.com/sanjivraa',
  Instagram: 'https://instagram.com/guhanixtech',
  YouTube:   'https://youtube.com/@guhanixtech',
};

const CONTACT_EMAIL = 'hello@guhanix.com';

const footerSections = {
  Services: [
    { label: 'AI Development',      href: '#services' },
    { label: 'Web Development',     href: '#services' },
    { label: 'Mobile Apps',         href: '#services' },
    { label: 'Cloud Solutions',     href: '#services' },
    { label: 'Enterprise Software', href: '#services' },
    { label: 'UI/UX Design',        href: '#services' },
  ],
  Company: [
    { label: 'About Us',   href: '#about'   },
    { label: 'Our Team',   href: '#founder' },
    { label: 'Careers',    href: `mailto:careers@guhanix.com` },
    { label: 'Press Kit',  href: `mailto:${CONTACT_EMAIL}?subject=Press%20Kit%20Request` },
    { label: 'Blog',       href: '#' },
    { label: 'Contact',    href: '#contact' },
  ],
  Resources: [
    { label: 'Case Studies',    href: '#projects' },
    { label: 'Documentation',   href: '#' },
    { label: 'API Reference',   href: '#' },
    { label: 'Status Page',     href: '#' },
    { label: 'Privacy Policy',  href: '#privacy'  },
    { label: 'Terms of Service',href: '#terms'    },
  ],
};

const socials = [
  { icon: Linkedin,  label: 'LinkedIn',  key: 'LinkedIn'  },
  { icon: Twitter,   label: 'Twitter',   key: 'Twitter'   },
  { icon: Github,    label: 'GitHub',    key: 'GitHub'    },
  { icon: Instagram, label: 'Instagram', key: 'Instagram' },
  { icon: Youtube,   label: 'YouTube',   key: 'YouTube'   },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subState, setSubState] = useState('idle'); // idle | loading | done | error

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollTo = (href) => {
    if (href.startsWith('mailto:') || href.startsWith('http')) {
      window.open(href, '_blank', 'noopener');
      return;
    }
    if (href === '#') return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { setSubState('error'); return; }
    setSubState('loading');
    // Opens mailto as a simple subscribe action — replace with your email service
    window.open(`mailto:${CONTACT_EMAIL}?subject=Newsletter%20Subscription&body=Please%20subscribe%20me%3A%20${encodeURIComponent(email)}`, '_blank');
    await new Promise(r => setTimeout(r, 600));
    setSubState('done');
    setEmail('');
    setTimeout(() => setSubState('idle'), 4000);
  };

  return (
    <footer style={{ background: '#030a14', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
      {/* Top glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '200px', background: 'radial-gradient(ellipse, rgba(255,107,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>Stay ahead of the curve</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>Get the latest insights on AI, technology, and digital transformation.</p>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email" value={email} onChange={e => { setEmail(e.target.value); setSubState('idle'); }}
                  placeholder="Enter your email"
                  style={{ background: subState === 'error' ? 'rgba(255,59,48,0.08)' : 'rgba(255,255,255,0.05)', border: `1px solid ${subState === 'error' ? 'rgba(255,59,48,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', padding: '12px 16px 12px 40px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: "'Inter', sans-serif", width: '260px', transition: 'border-color 0.2s' }}
                />
              </div>
              <motion.button type="submit" disabled={subState === 'loading' || subState === 'done'}
                whileHover={subState === 'idle' ? { scale: 1.04, boxShadow: '0 0 30px rgba(255,107,0,0.4)' } : {}}
                whileTap={subState === 'idle' ? { scale: 0.97 } : {}}
                style={{ background: subState === 'done' ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #FF6B00, #FF3B30)', color: subState === 'done' ? '#10B981' : 'white', border: subState === 'done' ? '1px solid rgba(16,185,129,0.4)' : 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: subState === 'idle' ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                {subState === 'done' ? <><CheckCircle size={16} /> Subscribed!</> : subState === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container" style={{ padding: '80px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: '60px', marginBottom: '60px' }} className="footer-grid">

          {/* Brand */}
          <div>
            <motion.div whileHover={{ scale: 1.02 }} onClick={scrollToTop}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }}>
              <div style={{ width: '42px', height: '42px', flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(255,107,0,0.4))' }}>
                <img src="/src/assets/logo.svg" alt="Guhanix Logo" style={{ width: '42px', height: '42px', borderRadius: '10px' }} />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>
                  <span style={{ color: '#1A8FFF' }}>GUHA</span><span style={{ color: '#FF6B00' }}>NIX</span>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>TECHNOLOGY</div>
              </div>
            </motion.div>

            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', marginBottom: '28px', maxWidth: '280px' }}>
              Engineering the future through intelligent technology. Premium solutions for forward-thinking enterprises worldwide.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              {socials.map((s, i) => (
                <motion.a key={i} href={SOCIAL_LINKS[s.key]} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.9 }}
                  style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s', textDecoration: 'none' }}>
                  <s.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerSections).map(([category, links]) => (
            <div key={category}>
              <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>{category}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map((link, i) => (
                  <li key={i}>
                    <motion.button onClick={() => scrollTo(link.href)}
                      whileHover={{ x: 4, color: '#FF6B00' }}
                      style={{ background: 'none', border: 'none', padding: 0, fontSize: '14px', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: "'Inter', sans-serif", textAlign: 'left' }}>
                      {link.label}
                      {(link.href.startsWith('mailto:') || link.href.startsWith('http')) && <ArrowUpRight size={11} style={{ opacity: 0.5 }} />}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Guhanix Technologies. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'Privacy Policy',   href: `mailto:${CONTACT_EMAIL}?subject=Privacy%20Policy%20Inquiry` },
              { label: 'Terms of Service', href: `mailto:${CONTACT_EMAIL}?subject=Terms%20of%20Service%20Inquiry` },
              { label: 'Cookie Policy',    href: `mailto:${CONTACT_EMAIL}?subject=Cookie%20Policy%20Inquiry` },
            ].map((item, i) => (
              <motion.button key={i} onClick={() => window.open(item.href, '_blank')}
                whileHover={{ color: '#FF6B00' }}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color 0.2s', fontFamily: "'Inter', sans-serif" }}>
                {item.label}
              </motion.button>
            ))}
          </div>
          <motion.button onClick={scrollToTop}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,107,0,0.4)' }} whileTap={{ scale: 0.9 }}
            style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', color: '#FF6B00', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700' }}>
            ↑
          </motion.button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
};

export default Footer;
