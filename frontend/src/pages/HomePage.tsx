import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { createShortURL } from "../api/url"
import { useDarkMode } from "../App"

export default function HomePage() {
  const navigate = useNavigate()
  const [url, setURL] = useState("")
  const [loading, setLoading] = useState(false)
  const { darkMode, toggleDarkMode } = useDarkMode()
  const token = localStorage.getItem("token")

  const handleShorten = async () => {
    if (!token) { navigate("/login"); return }
    try {
      setLoading(true)
      await createShortURL(url, "")
      toast.success("Short URL created")
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
      toast.error("Failed to create URL")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sy-page" style={{ minHeight: "100vh" }}>
      <div className="sy-noise" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "28px 24px 80px" }}>

        {/* Navihation */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 72 }}>
          <div className="sy-wordmark">
            <div className="sy-wordmark-dot" />
            <span className="sy-wordmark-text">shortlyy</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="sy-theme-btn" onClick={toggleDarkMode} aria-label="Toggle theme">
              {darkMode ? "☀️" : "🌙"}
            </button>
            {!token ? (
              <button
                onClick={() => navigate("/login")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)", fontFamily: "DM Sans, sans-serif", padding: "8px 12px", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                Sign in
              </button>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)", fontFamily: "DM Sans, sans-serif", padding: "8px 12px", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                Dashboard
              </button>
            )}
            <button
              className="sy-btn sy-btn--pill"
              style={{ padding: "8px 18px", fontSize: 13 }}
              onClick={() => navigate("/signup")}
            >
              Get started
            </button>
          </div>
        </nav>

        {/* Main section */}
        <div style={{ marginBottom: 64 }}>
          <div className="sy-badge" style={{ marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block", animation: "pulse 2s infinite" }} />
            Live on shortlyy.in
          </div>

          <h1 className="sy-serif" style={{
            fontSize: "clamp(3rem, 9vw, 6.5rem)",
            lineHeight: 0.93,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            marginBottom: 20,
            transition: "color 0.25s ease",
          }}>
            Links that<br />
            <em style={{ fontStyle: "italic" }}>tell a story.</em>
          </h1>

          <p style={{ maxWidth: 440, fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.65, fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>
            Shorten, track, and share URLs with beautiful analytics, instant QR codes, and a dashboard built for clarity.
          </p>
        </div>

        {/* input form */}
        <div className="sy-card sy-card--static" style={{ padding: 6, display: "flex", flexDirection: "row", gap: 6, flexWrap: "wrap", maxWidth: 600, marginBottom: 12, boxShadow: "var(--shadow-card)" }}>
          <input
            className="sy-input"
            style={{ flex: 1, minWidth: 200, background: "transparent", border: "none", borderRadius: 10, padding: "12px 14px" }}
            placeholder="Paste any URL…"
            value={url}
            onChange={e => setURL(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleShorten()}
          />
          <button className="sy-btn" disabled={loading} onClick={handleShorten} style={{ borderRadius: 10, padding: "12px 22px" }}>
            {loading ? "Shortening…" : "Shorten →"}
          </button>
        </div>

        <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 80, fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>
          Free to use · No credit card · Sign up to track clicks
        </p>

        {/* HEHE */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { icon: "📈", label: "Analytics", desc: "Real-time click tracking with beautiful charts for every link." },
            { icon: "⬛", label: "QR Codes",  desc: "Instant QR generation — scannable anywhere you need it." },
            { icon: "⚡", label: "Go-powered", desc: "Sub-millisecond redirects on Go, Redis & PostgreSQL." },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="sy-feature-card">
              <div style={{ fontSize: 22, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)", marginBottom: 6, fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>{label}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
      `}</style>
    </div>
  )
}