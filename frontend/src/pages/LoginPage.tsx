import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { login } from "../api/auth"
import axios from "axios"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      const data = await login(email, password)
      localStorage.setItem("token", data.token)
      navigate("/")
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error)
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sy-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 16 }}>
      <div className="sy-noise" />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 340 }}>
        {/* Words */}
        <div className="sy-wordmark" style={{ justifyContent: "center", marginBottom: 32 }} onClick={() => navigate("/")}>
          <div className="sy-wordmark-dot" />
          <span className="sy-wordmark-text">shortlyy</span>
        </div>

        <div className="sy-auth-card">
          <div style={{ marginBottom: 24 }}>
            <h1 className="sy-serif" style={{ fontSize: 26, color: "var(--text-primary)", marginBottom: 4, transition: "color 0.25s ease" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>
              Sign in to your shortlyy account
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="sy-label">Email</label>
              <input
                className="sy-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="sy-label">Password</label>
              <input
                className="sy-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button
              className="sy-btn sy-btn--full"
              disabled={loading}
              onClick={handleLogin}
              style={{ marginTop: 4 }}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>
          No account yet?{" "}
          <a href="/signup" style={{ color: "var(--text-primary)", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.25s ease" }}>
            Create one
          </a>
        </p>
      </div>
    </div>
  )
}