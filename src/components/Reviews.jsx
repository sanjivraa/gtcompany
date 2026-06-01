import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, Send, CheckCircle, X, MessageSquare, Loader2 } from "lucide-react";
import {
  collection, addDoc, getDocs, updateDoc, doc,
  query, orderBy, serverTimestamp, onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";

const COLORS = ["#FF6B00", "#1A8FFF", "#10B981", "#0A6FD4", "#F59E0B", "#FF3B30"];
const COLLECTION = "guhanix_reviews";

/* ─── Fallback reviews shown when Firebase isn't configured yet ─── */
const FALLBACK = [
  { id: "f1", name: "Alex Johnson", role: "CTO, TechCorp", rating: 5, date: "2025-05-10", text: "Guhanix is building something truly special. Even as a new startup, the quality of their work and the vision behind it is extraordinary. Highly recommend.", helpful: 12, avatar: "AJ", color: "#FF6B00" },
  { id: "f2", name: "Priya Nair", role: "Product Manager", rating: 5, date: "2025-05-18", text: "Worked with Sanjiv and the team on our MVP. The attention to detail, the animations, the performance — everything was top-notch. A startup that punches way above its weight.", helpful: 8, avatar: "PN", color: "#1A8FFF" },
  { id: "f3", name: "Marcus Lee", role: "Startup Founder", rating: 5, date: "2025-05-22", text: "Fresh startup with a senior-level mindset. Guhanix delivered our web app in record time with stunning UI. This team is going places.", helpful: 15, avatar: "ML", color: "#10B981" },
];

/* ─── Star picker ─── */
function StarPicker({ value, onChange, size = 28 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <motion.button key={s} type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
        >
          <Star size={size}
            fill={(hovered || value) >= s ? "#FF6B00" : "transparent"}
            color={(hovered || value) >= s ? "#FF6B00" : "rgba(255,255,255,0.2)"}
            style={{ transition: "all 0.15s" }}
          />
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Single review card ─── */
function ReviewCard({ review, index, inView, onHelpful }) {
  const [voted, setVoted] = useState(false);

  const timeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  const handleHelpful = () => {
    if (voted) return;
    setVoted(true);
    onHelpful(review.id, review.helpful || 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: `0 24px 60px ${review.color}18` }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px", padding: "28px",
        position: "relative", overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${review.color}, transparent)` }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${review.color}, ${review.color}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "white", boxShadow: `0 0 16px ${review.color}40` }}>
            {review.avatar}
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "white" }}>{review.name}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{review.role}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", gap: "2px", justifyContent: "flex-end", marginBottom: "4px" }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "#FF6B00" : "transparent"} color={s <= review.rating ? "#FF6B00" : "rgba(255,255,255,0.15)"} />)}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>{timeAgo(review.date)}</div>
        </div>
      </div>

      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.75", marginBottom: "20px" }}>
        "{review.text}"
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <motion.button onClick={handleHelpful}
          whileHover={!voted ? { scale: 1.05 } : {}} whileTap={!voted ? { scale: 0.95 } : {}}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: voted ? "rgba(255,107,0,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${voted ? "rgba(255,107,0,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", color: voted ? "#FF6B00" : "rgba(255,255,255,0.4)", cursor: voted ? "default" : "pointer", transition: "all 0.2s" }}
        >
          <ThumbsUp size={13} /> Helpful ({review.helpful || 0})
        </motion.button>
        <div style={{ fontSize: "11px", fontWeight: "600", color: review.color, background: `${review.color}12`, border: `1px solid ${review.color}25`, padding: "3px 10px", borderRadius: "100px" }}>
          {"★".repeat(review.rating)}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Reviews section ─── */
const Reviews = () => {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firebaseOk, setFirebaseOk] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", rating: 0, text: "" });
  const [formError, setFormError] = useState("");

  /* ── Real-time listener ── */
  useEffect(() => {
    let unsub;

    const startListener = () => {
      try {
        // Try ordered query first (requires Firestore index)
        const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
        unsub = onSnapshot(
          q,
          (snap) => {
            if (snap.empty) {
              setReviews(FALLBACK);
            } else {
              setReviews(
                snap.docs.map(d => ({
                  id: d.id,
                  ...d.data(),
                  date:
                    d.data().createdAt?.toDate?.()?.toISOString?.()?.split("T")[0] ??
                    d.data().date ??
                    "",
                }))
              );
            }
            setLoading(false);
            setFirebaseOk(true);
          },
          async (err) => {
            console.warn("Ordered query failed:", err.code, err.message);

            // If index missing, fall back to unordered collection snapshot
            if (err.code === "failed-precondition" || err.code === "unimplemented") {
              try {
                const plain = onSnapshot(
                  collection(db, COLLECTION),
                  (snap2) => {
                    if (snap2.empty) {
                      setReviews(FALLBACK);
                    } else {
                      const docs = snap2.docs
                        .map(d => ({
                          id: d.id,
                          ...d.data(),
                          date:
                            d.data().createdAt?.toDate?.()?.toISOString?.()?.split("T")[0] ??
                            d.data().date ??
                            "",
                        }))
                        .sort((a, b) => (b.date > a.date ? 1 : -1));
                      setReviews(docs);
                    }
                    setLoading(false);
                    setFirebaseOk(true);
                  },
                  (err2) => {
                    console.warn("Firestore read denied:", err2.code, err2.message);
                    setReviews(FALLBACK);
                    setLoading(false);
                    setFirebaseOk(false);
                  }
                );
                unsub = plain;
              } catch (e) {
                setReviews(FALLBACK);
                setLoading(false);
                setFirebaseOk(false);
              }
            } else {
              // permission-denied or network error
              setReviews(FALLBACK);
              setLoading(false);
              setFirebaseOk(false);
            }
          }
        );
      } catch (err) {
        console.warn("Firebase init error:", err.message);
        setReviews(FALLBACK);
        setLoading(false);
        setFirebaseOk(false);
      }
    };

    startListener();
    return () => unsub?.();
  }, []);

  /* ── Helpful vote ── */
  const handleHelpful = async (id, current) => {
    if (!firebaseOk || id.startsWith("f")) return;
    try {
      await updateDoc(doc(db, COLLECTION, id), { helpful: current + 1 });
    } catch { /* silent */ }
  };

  /* ── Submit review ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("Please enter your name."); return; }
    if (!form.rating) { setFormError("Please select a star rating."); return; }
    if (form.text.trim().length < 20) { setFormError("Review must be at least 20 characters."); return; }
    setFormError("");
    setSubmitting(true);

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || "Client",
      rating: form.rating,
      date: new Date().toISOString().split("T")[0],
      text: form.text.trim(),
      helpful: 0,
      avatar: form.name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      color,
      createdAt: serverTimestamp(),
    };

    try {
      if (firebaseOk) {
        await addDoc(collection(db, COLLECTION), payload);
      } else {
        // Fallback: prepend locally
        setReviews(prev => [{ ...payload, id: `local_${Date.now()}` }, ...prev]);
      }
      setSubmitted(true);
      setForm({ name: "", role: "", rating: 0, text: "" });
      setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
    } catch (err) {
      setFormError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <section id="reviews" ref={ref} className="section-padding" style={{ background: "linear-gradient(180deg, #050A14 0%, #080f1c 50%, #050A14 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.3), transparent)" }} />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Client Reviews</div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "800", marginBottom: "16px" }}>
            What Our{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B00, #FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Clients Say</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", maxWidth: "500px", margin: "0 auto" }}>
            Real reviews from real clients.{" "}
            {firebaseOk
              ? <span style={{ color: "#10B981", fontSize: "13px" }}>● Live from Firebase</span>
              : <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Configure Firebase to enable live reviews</span>}
          </p>
        </motion.div>

        {/* Rating summary */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}
          className="review-summary"
          style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "40px", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "36px 40px", marginBottom: "48px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "72px", fontWeight: "900", lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #FF6B00, #FF3B30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{avg}</div>
            <div style={{ display: "flex", gap: "4px", justifyContent: "center", margin: "10px 0 6px" }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= Math.round(parseFloat(avg)) ? "#FF6B00" : "transparent"} color={s <= Math.round(parseFloat(avg)) ? "#FF6B00" : "rgba(255,255,255,0.2)"} />)}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {distribution.map(({ star, count, pct }) => (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", gap: "2px", width: "70px", flexShrink: 0 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= star ? "#FF6B00" : "transparent"} color={s <= star ? "#FF6B00" : "rgba(255,255,255,0.15)"} />)}
                </div>
                <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: "4px", background: "linear-gradient(90deg, #FF6B00, #FF3B30)" }} />
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", width: "30px", textAlign: "right" }}>{count}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Write review button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} style={{ textAlign: "center", marginBottom: "48px" }}>
          <motion.button onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,107,0,0.4)" }} whileTap={{ scale: 0.97 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: showForm ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #FF6B00, #FF3B30)", color: "white", border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none", padding: "14px 32px", borderRadius: "14px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: showForm ? "none" : "0 0 30px rgba(255,107,0,0.3)" }}>
            {showForm ? <><X size={18} /> Cancel</> : <><MessageSquare size={18} /> Write a Review</>}
          </motion.button>
        </motion.div>

        {/* Review form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden", marginBottom: "48px" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: "24px", padding: "40px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #FF6B00, transparent)" }} />

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", padding: "40px 0" }}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 30px rgba(16,185,129,0.3)" }}>
                        <CheckCircle size={36} color="#10B981" />
                      </motion.div>
                      <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>Review Submitted!</h3>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Thank you for sharing your experience with Guhanix Technologies.</p>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit}>
                      <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "28px" }}>Share Your Experience</h3>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }} className="form-grid">
                        {[{ label: "Your Name *", key: "name", placeholder: "John Smith" }, { label: "Role / Company", key: "role", placeholder: "CTO at Acme Corp" }].map(f => (
                          <div key={f.key}>
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>{f.label}</label>
                            <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 14px", color: "white", fontSize: "14px", outline: "none", fontFamily: "'Inter', sans-serif" }} />
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Your Rating *</label>
                        <StarPicker value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
                        {form.rating > 0 && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: "13px", color: "#FF6B00", marginTop: "8px", fontWeight: "600" }}>
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]} — {form.rating}/5 stars
                          </motion.div>
                        )}
                      </div>

                      <div style={{ marginBottom: "24px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Your Review * (min. 20 chars)</label>
                        <textarea placeholder="Share your experience working with Guhanix Technologies..." value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows={4}
                          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px", color: "white", fontSize: "14px", outline: "none", fontFamily: "'Inter', sans-serif", resize: "vertical", lineHeight: "1.6" }} />
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "6px", textAlign: "right" }}>{form.text.length} chars</div>
                      </div>

                      {formError && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                          style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#FF3B30", marginBottom: "16px" }}>
                          ⚠ {formError}
                        </motion.div>
                      )}

                      <motion.button type="submit" disabled={submitting}
                        whileHover={!submitting ? { scale: 1.03, boxShadow: "0 0 40px rgba(255,107,0,0.5)" } : {}} whileTap={!submitting ? { scale: 0.97 } : {}}
                        style={{ display: "flex", alignItems: "center", gap: "10px", background: submitting ? "rgba(255,107,0,0.5)" : "linear-gradient(135deg, #FF6B00, #FF3B30)", color: "white", border: "none", padding: "14px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 0 30px rgba(255,107,0,0.3)" }}>
                        {submitting ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</> : <><Send size={17} /> Submit Review</>}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block" }}>
              <Loader2 size={32} color="#FF6B00" />
            </motion.div>
            <p style={{ color: "rgba(255,255,255,0.3)", marginTop: "16px", fontSize: "14px" }}>Loading reviews...</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} inView={inView} onHelpful={handleHelpful} />
            ))}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
            <MessageSquare size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
            <p style={{ fontSize: "16px" }}>No reviews yet. Be the first to share your experience!</p>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .review-summary { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default Reviews;
