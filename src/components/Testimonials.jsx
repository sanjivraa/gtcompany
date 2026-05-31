import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'CTO, NexaFinance',
    company: 'NexaFinance',
    avatar: 'SM',
    color: '#FF6B00',
    rating: 5,
    text: 'Guhanix transformed our entire data infrastructure with an AI platform that processes 10 million transactions daily. The team\'s technical depth and execution speed are unmatched. We saw a 40% reduction in operational costs within the first quarter.',
    metric: '40% Cost Reduction'
  },
  {
    name: 'James Thornton',
    role: 'VP Engineering, CloudScale',
    company: 'CloudScale',
    avatar: 'JT',
    color: '#1A8FFF',
    rating: 5,
    text: 'Working with Guhanix felt like having a world-class engineering team embedded in our company. They delivered our cloud migration 3 weeks ahead of schedule with zero downtime. The quality of their architecture decisions is exceptional.',
    metric: '3 Weeks Ahead of Schedule'
  },
  {
    name: 'Priya Sharma',
    role: 'CEO, MediSync Health',
    company: 'MediSync',
    avatar: 'PS',
    color: '#0A6FD4',
    rating: 5,
    text: 'Our healthcare app went from concept to 500K users in 8 months. Guhanix\'s Flutter expertise and AI integration capabilities are genuinely world-class. The app has a 4.9-star rating and our patient engagement increased by 300%.',
    metric: '500K Users in 8 Months'
  },
  {
    name: 'Marcus Weber',
    role: 'Director of Technology, RetailIQ',
    company: 'RetailIQ',
    avatar: 'MW',
    color: '#10B981',
    rating: 5,
    text: 'The analytics platform Guhanix built for us completely changed how we make inventory decisions. Real-time insights across 200 stores, AI-driven demand forecasting — it\'s like having a crystal ball for our business. Revenue up 35%.',
    metric: '35% Revenue Increase'
  },
  {
    name: 'Elena Vasquez',
    role: 'Head of Digital, SmartCity Corp',
    company: 'SmartCity Corp',
    avatar: 'EV',
    color: '#F59E0B',
    rating: 5,
    text: 'Guhanix delivered a smart city platform managing 1 million IoT sensors across 3 cities. The system\'s reliability and performance exceeded every benchmark. Energy consumption dropped 25% city-wide. Truly remarkable engineering.',
    metric: '25% Energy Savings'
  },
  {
    name: 'David Chen',
    role: 'Founder, TechVentures',
    company: 'TechVentures',
    avatar: 'DC',
    color: '#FF3B30',
    rating: 5,
    text: 'I\'ve worked with dozens of tech companies. Guhanix is in a different league. Their attention to detail, proactive communication, and technical excellence make them the only partner I recommend to my portfolio companies.',
    metric: '10+ Referrals Given'
  },
];

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {[...Array(rating)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.05 }}
      >
        <Star size={14} fill="#FF6B00" color="#FF6B00" />
      </motion.div>
    ))}
  </div>
);

const Testimonials = () => {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const navigate = (dir) => {
    setIsAutoPlaying(false);
    setDirection(dir);
    setCurrent(prev => (prev + dir + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0, scale: 0.95 }),
  };

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      ref={ref}
      className="section-padding"
      style={{ background: '#050A14', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.3), transparent)'
      }} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px', height: '800px',
          border: '1px solid rgba(255,107,0,0.04)',
          borderRadius: '50%', pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>Client Stories</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', marginBottom: '20px' }}>
            Trusted by{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF6B00, #FF3B30)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Industry Leaders
            </span>
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
            Don't take our word for it — hear from the executives who've experienced the Guhanix difference.
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}
        >
          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${t.color}25`,
            borderRadius: '32px', padding: 'clamp(32px, 5vw, 60px)',
            position: 'relative', overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            minHeight: '320px',
            transition: 'border-color 0.5s ease'
          }}>
            {/* Top glow line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: `linear-gradient(90deg, transparent, ${t.color}, transparent)`,
              transition: 'background 0.5s ease'
            }} />

            {/* Quote icon */}
            <div style={{
              position: 'absolute', top: '30px', right: '40px',
              opacity: 0.08
            }}>
              <Quote size={80} color={t.color} />
            </div>

            {/* Background glow */}
            <div style={{
              position: 'absolute', top: '-50%', right: '-20%',
              width: '400px', height: '400px', borderRadius: '50%',
              background: `radial-gradient(circle, ${t.color}08 0%, transparent 70%)`,
              pointerEvents: 'none', transition: 'background 0.5s ease'
            }} />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Stars */}
                <div style={{ marginBottom: '24px' }}>
                  <StarRating rating={t.rating} />
                </div>

                {/* Quote text */}
                <p style={{
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: '1.75', marginBottom: '36px',
                  fontStyle: 'italic', fontWeight: '400',
                  maxWidth: '720px'
                }}>
                  "{t.text}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: '800', color: 'white',
                      fontFamily: "'Space Grotesk', sans-serif",
                      boxShadow: `0 0 20px ${t.color}40`,
                      flexShrink: 0
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>{t.name}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{t.role}</div>
                    </div>
                  </div>

                  {/* Metric badge */}
                  <div style={{
                    background: `${t.color}15`,
                    border: `1px solid ${t.color}30`,
                    borderRadius: '100px', padding: '8px 18px',
                    fontSize: '13px', fontWeight: '700',
                    color: t.color
                  }}>
                    ✦ {t.metric}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '16px', marginTop: '40px'
          }}>
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.1, background: 'rgba(255,107,0,0.15)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <ChevronLeft size={20} />
            </motion.button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); setIsAutoPlaying(false); }}
                  animate={{
                    width: i === current ? '28px' : '8px',
                    background: i === current ? '#FF6B00' : 'rgba(255,255,255,0.2)'
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '8px', borderRadius: '4px',
                    border: 'none', cursor: 'pointer', padding: 0
                  }}
                />
              ))}
            </div>

            <motion.button
              onClick={() => navigate(1)}
              whileHover={{ scale: 1.1, background: 'rgba(255,107,0,0.15)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Mini testimonial cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px', marginTop: '60px'
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); setIsAutoPlaying(false); }}
              whileHover={{ y: -4, borderColor: `${t.color}40` }}
              animate={{
                borderColor: i === current ? `${t.color}50` : 'rgba(255,255,255,0.07)',
                background: i === current ? `${t.color}08` : 'rgba(255,255,255,0.02)'
              }}
              transition={{ duration: 0.3 }}
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '16px',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '12px'
              }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '800', color: 'white'
              }}>
                {t.avatar}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{t.company}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
