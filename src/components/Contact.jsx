import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight, MessageSquare, Calendar } from 'lucide-react';
import { Reveal, Stagger, StaggerChild } from './AnimatedSection';

const CONTACT_EMAIL = 'hello@guhanix.com';
const WHATSAPP_NUMBER = ''; // e.g. '919876543210' — add your WhatsApp number here
const CALENDLY_URL = ''; // e.g. 'https://calendly.com/guhanix' — add your Calendly link here

const contactInfo = [
  { icon: Mail,   label: 'Email Us',      value: 'hello@guhanix.com',   color: '#FF6B00', action: () => window.open(`mailto:${CONTACT_EMAIL}`, '_blank') },
  { icon: Phone,  label: 'Call Us',       value: '+91 00000 00000',      color: '#1A8FFF', action: () => window.open('tel:+910000000000', '_blank') },
  { icon: MapPin, label: 'Headquarters',  value: 'Chennai, Tamil Nadu',  color: '#10B981', action: null },
];

const FloatingInput = ({ label, type = 'text', name, value, onChange, required, multiline }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused ? '#FF6B00' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '12px',
    padding: multiline ? '20px 16px 12px' : '20px 16px 8px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif",
    resize: multiline ? 'vertical' : 'none',
    minHeight: multiline ? '120px' : 'auto',
    boxShadow: focused ? '0 0 0 3px rgba(255,107,0,0.1)' : 'none',
  };

  const labelStyle = {
    position: 'absolute',
    left: '16px',
    top: focused || hasValue ? '8px' : '50%',
    transform: focused || hasValue ? 'translateY(0) scale(0.8)' : 'translateY(-50%) scale(1)',
    transformOrigin: 'left',
    color: focused ? '#FF6B00' : 'rgba(255,255,255,0.35)',
    fontSize: '14px',
    fontWeight: '500',
    pointerEvents: 'none',
    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
    zIndex: 1,
  };

  if (multiline) {
    labelStyle.top = focused || hasValue ? '8px' : '16px';
    labelStyle.transform = focused || hasValue ? 'translateY(0) scale(0.8)' : 'translateY(0) scale(1)';
  }

  return (
    <div style={{ position: 'relative' }}>
      <label style={labelStyle}>{label}{required && ' *'}</label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          style={inputStyle}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          style={inputStyle}
        />
      )}
    </div>
  );
};

const Contact = () => {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    // Build a mailto link with all form data
    const subject = encodeURIComponent(`[Guhanix Inquiry] ${formData.service ? formData.service.toUpperCase() + ' - ' : ''}${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'N/A'}\nService: ${formData.service || 'General'}\n\nMessage:\n${formData.message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="section-padding"
      style={{ background: '#050A14', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.3), transparent)'
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', marginBottom: '20px' }}>
            Let's Build Something{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Extraordinary
            </span>
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
            Ready to transform your business? Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px', alignItems: 'start'
        }}>
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              Start a Conversation
            </h3>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', marginBottom: '40px' }}>
              Whether you have a detailed brief or just an idea, we're here to help you navigate the path
              from concept to world-class product.
            </p>

            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 6 }}
                  onClick={() => info.action?.()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px', padding: '16px 20px',
                    transition: 'all 0.3s ease', cursor: info.action ? 'pointer' : 'default'
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    background: `${info.color}15`,
                    border: `1px solid ${info.color}25`,
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <info.icon size={20} color={info.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {info.label}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'white', marginTop: '2px' }}>
                      {info.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: MessageSquare, label: 'Live Chat / WhatsApp', sub: 'Message us on WhatsApp', color: '#FF6B00',
                  action: () => WHATSAPP_NUMBER
                    ? window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Guhanix%2C%20I%27d%20like%20to%20discuss%20a%20project`, '_blank')
                    : window.open(`mailto:${CONTACT_EMAIL}?subject=Live%20Chat%20Request`, '_blank') },
                { icon: Calendar, label: 'Schedule a Call', sub: 'Book a 30-min discovery call', color: '#1A8FFF',
                  action: () => CALENDLY_URL
                    ? window.open(CALENDLY_URL, '_blank')
                    : window.open(`mailto:${CONTACT_EMAIL}?subject=Schedule%20a%20Discovery%20Call&body=Hi%2C%20I%27d%20like%20to%20schedule%20a%2030-minute%20discovery%20call.%20My%20availability%3A%20`, '_blank') },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  onClick={action.action}
                  whileHover={{ scale: 1.02, borderColor: `${action.color}40` }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px', padding: '14px 18px',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.3s ease', width: '100%'
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', flexShrink: 0,
                    background: `${action.color}12`,
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <action.icon size={18} color={action.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{action.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{action.sub}</div>
                  </div>
                  <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px', padding: 'clamp(28px, 4vw, 48px)',
              backdropFilter: 'blur(20px)',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Top glow */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.5), transparent)'
              }} />

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <FloatingInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                      <FloatingInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <FloatingInput label="Company Name" name="company" value={formData.company} onChange={handleChange} />

                    {/* Service Select */}
                    <div style={{ position: 'relative' }}>
                      <label style={{
                        position: 'absolute', left: '16px', top: '8px',
                        fontSize: '11px', fontWeight: '600',
                        color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em',
                        textTransform: 'uppercase', zIndex: 1
                      }}>
                        Service Needed
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          padding: '28px 16px 10px',
                          color: formData.service ? 'white' : 'rgba(255,255,255,0.4)',
                          fontSize: '15px', outline: 'none',
                          fontFamily: "'Inter', sans-serif",
                          cursor: 'pointer',
                          appearance: 'none'
                        }}
                      >
                        <option value="" style={{ background: '#111' }}>Select a service...</option>
                        <option value="ai" style={{ background: '#111' }}>AI Development</option>
                        <option value="web" style={{ background: '#111' }}>Web Development</option>
                        <option value="mobile" style={{ background: '#111' }}>Mobile App Development</option>
                        <option value="cloud" style={{ background: '#111' }}>Cloud Solutions</option>
                        <option value="enterprise" style={{ background: '#111' }}>Enterprise Software</option>
                        <option value="design" style={{ background: '#111' }}>UI/UX Design</option>
                      </select>
                    </div>

                    <FloatingInput label="Tell us about your project" name="message" value={formData.message} onChange={handleChange} required multiline />

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 50px rgba(255,107,0,0.5)' } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      style={{
                        background: loading ? 'rgba(255,107,0,0.5)' : 'linear-gradient(135deg, #FF6B00, #FF3B30)',
                        color: 'white', border: 'none',
                        padding: '16px 32px', borderRadius: '14px',
                        fontSize: '15px', fontWeight: '700',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        boxShadow: '0 0 30px rgba(255,107,0,0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{
                              width: '18px', height: '18px', borderRadius: '50%',
                              border: '2px solid rgba(255,255,255,0.3)',
                              borderTopColor: 'white'
                            }}
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send size={18} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ textAlign: 'center', padding: '40px 20px' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
                      style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(16,185,129,0.15)',
                        border: '2px solid rgba(16,185,129,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 0 40px rgba(16,185,129,0.3)'
                      }}
                    >
                      <CheckCircle size={40} color="#10B981" />
                    </motion.div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>
                      Message Sent!
                    </h3>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', marginBottom: '28px' }}>
                      Thank you for reaching out. Our team will review your project and get back to you within 24 hours.
                    </p>
                    <motion.button
                      onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', company: '', service: '', message: '' }); }}
                      whileHover={{ scale: 1.04 }}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'white', padding: '12px 28px',
                        borderRadius: '12px', fontSize: '14px',
                        fontWeight: '600', cursor: 'pointer'
                      }}
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
