import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {QRCode} from "react-qr-code"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { createShortURL, deleteURL, getMyURLs } from "../api/url"
import axios from "axios"
import {useNavigate}  from "react-router-dom"

export default function DashboardPage() {
  const [urls, setUrls] = useState<any[]>([])
  const [url, setURL] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [qrCode, setQRCode] = useState("")
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  )
  const navigate = useNavigate()
  const fetchURLs = async () => {
    try {
      const data = await getMyURLs()
      setUrls(data.urls|| [])
    } catch (error) {
  console.error(error)

  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.error
    toast.error(message)
    
  } else {
    toast.error("Something went wrong")
  }
}
  }

  useEffect(() => { fetchURLs() }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

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
    const message =error.response?.data?.error
    
    if (message === "invalid request body"){
      toast.error("Enter valid url")
    }else{
      toast.error(message)
    }
  } else {
    toast.error("Something went wrong")
  }
} finally {
      setLoading(false)
    }
  }

  const handleCopy = async (shortCode: string) => {
    await navigator.clipboard.writeText(`http://localhost:8080/${shortCode}`)
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
    if (active && payload?.length) {
      return (
        <div className="bg-black text-white px-3 py-2 rounded-lg text-xs font-['DM_Sans',sans-serif]">
          <p className="font-medium">{label}</p>
          <p>{payload[0].value} clicks</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0C0C0C] transition-colors duration-300">

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025] dark:opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-20">

        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-black dark:bg-white" />
            <span onClick={() => navigate("/")}
            className="text-lg font-['Instrument_Serif',serif] tracking-tight dark:text-white">
              Shortly
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 text-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-['DM_Sans',sans-serif] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-['Instrument_Serif',serif] dark:text-white mb-2">
            Your links
          </h1>
          <p className="text-sm font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-500">
            Track performance and manage your short URLs
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total links", value: urls.length },
            { label: "Total clicks", value: totalClicks },
            { label: "Status", value: "Active" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5"
            >
              <p className="text-xs font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-500 mb-2">
                {label}
              </p>
              <p className="text-2xl sm:text-3xl font-['Instrument_Serif',serif] text-black dark:text-white leading-none">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-base font-['DM_Sans',sans-serif] font-medium dark:text-white mb-1">
              Click performance
            </h2>
            <p className="text-xs font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-500 mb-6">
              Clicks per short URL
            </p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="40%">
                  <XAxis
                    dataKey="shortCode"
                    tick={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: "DM Sans, sans-serif", fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={darkMode ? "#FFFFFF" : "#0C0C0C"} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Create URL */}
        <div className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-base font-['DM_Sans',sans-serif] font-medium dark:text-white mb-5">
            Shorten a URL
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="https://your-long-url.com/goes/here"
              className="w-full bg-[#F7F5F0] dark:bg-[#0C0C0C] border border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 px-4 py-3 rounded-xl text-sm font-['DM_Sans',sans-serif] outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
              value={url}
              onChange={(e) => setURL(e.target.value)}
            />
            <input
              type="text"
              placeholder="Custom alias (optional)"
              className="w-full bg-[#F7F5F0] dark:bg-[#0C0C0C] border border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 px-4 py-3 rounded-xl text-sm font-['DM_Sans',sans-serif] outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
            <button
              onClick={handleCreate}
              disabled={loading || !url}
              className="bg-black dark:bg-white text-white dark:text-black text-sm font-['DM_Sans',sans-serif] font-medium px-6 py-3 rounded-xl hover:opacity-85 transition-opacity disabled:opacity-40"
            >
              {loading ? "Creating…" : "Create short URL →"}
            </button>
          </div>
        </div>

        {/* URL List */}
        <div className="space-y-3">
          {urls.length === 0 ? (
            <div className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-gray-800 rounded-2xl p-12 text-center">
              <p className="text-sm font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-600">
                No links yet — create your first one above
              </p>
            </div>
          ) : (
            urls.map((u) => (
              <div
                key={u.id}
                className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              >
                <p className="text-xs font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-500 mb-1 truncate">
                  {u.original_url}
                </p>
                <a
                  href={`http://localhost:8080/${u.short_code}`}
                  target="_blank"
                  className="text-black dark:text-white font-['Instrument_Serif',serif] text-xl hover:opacity-70 transition-opacity"
                >
                  shortly/{u.short_code}
                </a>

                <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
                  <div>
                    <p className="text-xs font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-500">
                      Clicks
                    </p>
                    <p className="text-2xl font-['Instrument_Serif',serif] dark:text-white leading-none">
                      {u.clicks}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(u.short_code)}
                      className="px-4 py-2 text-xs font-['DM_Sans',sans-serif] font-medium bg-[#F7F5F0] dark:bg-[#1A1A1A] text-black dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#242424] transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() =>
                        setQRCode(`http://localhost:8080/${u.short_code}`)
                      }
                      className="px-4 py-2 text-xs font-['DM_Sans',sans-serif] font-medium bg-[#F7F5F0] dark:bg-[#1A1A1A] text-black dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#242424] transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      QR
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-4 py-2 text-xs font-['DM_Sans',sans-serif] font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors border border-red-100 dark:border-red-900/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QR Modal */}
      {qrCode && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0"
          onClick={() => setQRCode("")}
        >
          <div
            className="bg-white dark:bg-[#141414] rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-['Instrument_Serif',serif] dark:text-white mb-6">
              Scan to visit
            </h2>
            <div className="bg-white p-4 rounded-2xl inline-block mb-6">
              <QRCode value={qrCode} size={160} />
            </div>
            <p className="text-xs font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-500 mb-5 break-all">
              {qrCode}
            </p>
            <button
              onClick={() => setQRCode("")}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl text-sm font-['DM_Sans',sans-serif] font-medium hover:opacity-85 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
