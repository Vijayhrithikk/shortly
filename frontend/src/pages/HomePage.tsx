import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { createShortURL } from "../api/url"

export default function HomePage() {
  const navigate = useNavigate()
  const [url, setURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [isnotLoggedin,setnotLoggedin] = useState(true)

  const handleShorten = async () => {
    const token = localStorage.getItem("token")
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
 
  const token = localStorage.getItem("token")
  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0C0C0C] font-['Instrument_Serif',serif] transition-colors duration-300">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025] dark:opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-24">
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-black dark:bg-white" />
            <span className="text-xl font-['Instrument_Serif',serif] tracking-tight dark:text-white">
              Shortly
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!token ? (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-['DM_Sans',sans-serif] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                          >
                   Sign in
                </button>
) : <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 text-sm font-['DM_Sans',sans-serif] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                          >
                   Dashboard
                </button>}
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 text-sm font-['DM_Sans',sans-serif] bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-85 transition-opacity"
            >
              Get started
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-full px-3 py-1 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-['DM_Sans',sans-serif] text-gray-600 dark:text-gray-400">
              Live — Make URLs shortened today
            </span>
          </div>

          <h1 className="text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] font-['Instrument_Serif',serif] tracking-tight text-black dark:text-white mb-6">
            Links that<br />
            <em className="italic">tell a story.</em>
          </h1>

          <p className="max-w-lg text-base font-['DM_Sans',sans-serif] text-gray-500 dark:text-gray-400 leading-relaxed">
            Shorten, track, and share URLs with beautiful analytics, instant QR codes, and a dashboard built for clarity.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mb-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none max-w-2xl">
          <input
            type="text"
            placeholder="Paste any URL…"
            className="flex-1 bg-transparent px-4 py-3 text-sm font-['DM_Sans',sans-serif] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
            value={url}
            onChange={(e) => setURL(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
          />
          <button
            onClick={handleShorten}
            disabled={loading}
            className="bg-black dark:bg-white text-white dark:text-black text-sm font-['DM_Sans',sans-serif] font-medium px-6 py-3 rounded-xl hover:opacity-85 transition-opacity disabled:opacity-40 whitespace-nowrap"
          >
            {loading ? "Shortening…" : "Shorten →"}
          </button>
        </div>

        <p className="text-xs font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-600 mb-32">
          Free to use · No credit card · Sign up to track clicks
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "📈",
              label: "Analytics",
              desc: "Real-time click tracking with beautiful charts for every link you create.",
            },
            {
              icon: "⬛",
              label: "QR Codes",
              desc: "Instant QR generation for any shortened URL — scannable everywhere.",
            },
            {
              icon: "⚡",
              label: "Go-powered",
              desc: "Built on Go, Redis & PostgreSQL for sub-millisecond redirects at scale.",
            },
          ].map(({ icon, label, desc }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-gray-800/60 rounded-2xl p-6 group hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="text-2xl mb-4">{icon}</div>
              <h3 className="text-base font-['DM_Sans',sans-serif] font-medium text-black dark:text-white mb-2">
                {label}
              </h3>
              <p className="text-sm font-['DM_Sans',sans-serif] text-gray-500 dark:text-gray-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
