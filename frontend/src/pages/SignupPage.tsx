import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { signup } from "../api/auth"
import axios from "axios"

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    try {
      setLoading(true)
      await signup(email, password)
      toast.success("Account created — welcome!")
      navigate("/login")
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error
        toast.error(message)
        if (message === "user already exists") navigate("/login")
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
              Create your account
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>
              Start shortening links in seconds
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
                placeholder="Choose a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSignup()}
              />
            </div>
            <button
              className="sy-btn sy-btn--full"
              disabled={loading}
              onClick={handleSignup}
              style={{ marginTop: 4 }}
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </div>

          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 16, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5, transition: "color 0.25s ease" }}>
            By signing up you agree to our{" "}
            <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "underline", textUnderlineOffset: 2 }}>Terms</a>
            {" "}and{" "}
            <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "underline", textUnderlineOffset: 2 }}>Privacy Policy</a>.
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "var(--text-primary)", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.25s ease" }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}