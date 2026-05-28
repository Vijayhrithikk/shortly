import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {QRCode} from "react-qr-code"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { createShortURL, deleteURL, getMyURLs } from "../api/url"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDarkMode } from "../App"

export default function DashboardPage() {
  const [urls, setUrls] = useState<any[]>([])
  const [url, setURL] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [qrCode, setQRCode] = useState("")
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useDarkMode()

  const fetchURLs = async () => {
    try {
      const data = await getMyURLs()
      setUrls(data.urls || [])
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  useEffect(() => { fetchURLs() }, [])

  const handleCreate = async () => {
    try {
      setLoading(true)
      await createShortURL(url, customCode)
      setURL("")
      setCustomCode("")
      fetchURLs()
      toast.success("Short URL created")
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error
        toast.error(message === "invalid request body" ? "Enter a valid URL" : message)
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (shortCode: string) => {
    await navigator.clipboard.writeText(`http://shortlyy.in/r/${shortCode}`)
    toast.success("Copied to clipboard")
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteURL(id)
      fetchURLs()
      toast.success("URL deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0)
  const chartData = urls.map((u) => ({ shortCode: u.short_code, clicks: u.clicks }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="sy-tooltip">
        <div style={{ fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div>{payload[0].value} clicks</div>
      </div>
    )
  }

  return (
    <div className="sy-page">
      <div className="sy-noise" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 840, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 44 }}>
          <div className="sy-wordmark" onClick={() => navigate("/")}>
            <div className="sy-wordmark-dot" />
            <span className="sy-wordmark-text">shortlyy</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="sy-theme-btn" onClick={toggleDarkMode} aria-label="Toggle theme">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)", fontFamily: "DM Sans, sans-serif", padding: "8px 10px", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Page title */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="sy-serif" style={{ fontSize: "clamp(2.2rem, 6vw, 3.4rem)", color: "var(--text-primary)", marginBottom: 6, transition: "color 0.25s ease" }}>
            Your links
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>
            Track performance and manage your short URLs
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Total links",  value: urls.length },
            { label: "Total clicks", value: totalClicks },
            { label: "Status",       value: "Active" },
          ].map(({ label, value }) => (
            <div key={label} className="sy-card sy-card--static" style={{ padding: "16px 18px" }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", transition: "color 0.25s ease" }}>
                {label}
              </p>
              <p className="sy-stat-value">{value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="sy-card sy-card--static" style={{ padding: "20px 20px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif", marginBottom: 3, transition: "color 0.25s ease" }}>
              Click performance
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", marginBottom: 20, transition: "color 0.25s ease" }}>
              Clicks per short URL
            </p>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="38%">
                  <XAxis
                    dataKey="shortCode"
                    tick={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    width={22}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-input)" }} />
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={darkMode ? "var(--cta-bg)" : "var(--cta-bg)"}
                        fillOpacity={darkMode ? 0.9 : 0.82}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* URL */}
        <div className="sy-card sy-card--static" style={{ padding: 20, marginBottom: 16 }}>
          <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif", marginBottom: 16, transition: "color 0.25s ease" }}>
            Shorten a URL
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              className="sy-input"
              type="text"
              placeholder="https://your-long-url.com/goes/here"
              value={url}
              onChange={e => setURL(e.target.value)}
            />
            <input
              className="sy-input"
              type="text"
              placeholder="Custom alias (optional)"
              value={customCode}
              onChange={e => setCustomCode(e.target.value)}
            />
            <div>
              <button
                className="sy-btn"
                disabled={loading || !url}
                onClick={handleCreate}
              >
                {loading ? "Creating…" : "Create short URL →"}
              </button>
            </div>
          </div>
        </div>

        {/* URL list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {urls.length === 0 ? (
            <div className="sy-card sy-card--static" style={{ padding: "44px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", transition: "color 0.25s ease" }}>
                No links yet — create your first one above
              </p>
            </div>
          ) : (
            urls.map((u) => (
              <div key={u.id} className="sy-card" style={{ padding: "18px 20px" }}>
                <p style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.25s ease" }}>
                  {u.original_url}
                </p>
                <a
                  href={`http://shortlyy.in/r/${u.short_code}`}
                  target="_blank"
                  className="sy-url-short"
                  style={{ display: "block", marginBottom: 16, textDecoration: "none" }}
                >
                  shortlyy.in/r/{u.short_code}
                </a>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em", transition: "color 0.25s ease" }}>Clicks</p>
                    <p className="sy-serif" style={{ fontSize: 26, color: "var(--text-primary)", lineHeight: 1, transition: "color 0.25s ease" }}>{u.clicks}</p>
                  </div>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button className="sy-btn-ghost" onClick={() => handleCopy(u.short_code)}>Copy</button>
                    <button className="sy-btn-ghost" onClick={() => setQRCode(`http://shortlyy.in/r/${u.short_code}`)}>QR</button>
                    <button className="sy-btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QR */}
      {qrCode && (
        <div className="sy-modal-backdrop" onClick={() => setQRCode("")}>
          <div className="sy-modal" onClick={e => e.stopPropagation()}>
            <h2 className="sy-serif" style={{ fontSize: 20, color: "var(--text-primary)", marginBottom: 20, transition: "color 0.25s ease" }}>
              Scan to visit
            </h2>
            <div className="sy-qr-wrap" style={{ marginBottom: 16 }}>
              <QRCode value={qrCode} size={156} />
            </div>
            <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif", marginBottom: 18, wordBreak: "break-all", lineHeight: 1.4, transition: "color 0.25s ease" }}>
              {qrCode}
            </p>
            <button className="sy-btn sy-btn--full" onClick={() => setQRCode("")}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}