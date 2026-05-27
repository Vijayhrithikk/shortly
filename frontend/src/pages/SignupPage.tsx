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
    const message =
      error.response?.data?.error
    toast.error(message)
    if ((message)==="user already exists"){
      navigate("/login")
    }
  } else {
    toast.error("Something went wrong")
  }
} finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#0C0C0C] flex items-center justify-center px-4 transition-colors">
      {/* Noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025] dark:opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Wordmark */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-5 h-5 rounded-full bg-black dark:bg-white" />
          <span onClick={() => navigate("/")}
          className="text-lg font-['Instrument_Serif',serif] tracking-tight dark:text-white">
            Shortly
          </span>
        </div>

        <div className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-none">
          <div className="mb-8">
            <h1 className="text-2xl font-['Instrument_Serif',serif] text-black dark:text-white mb-1">
              Create your account
            </h1>
            <p className="text-sm font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-500">
              Start shortening links in seconds
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-['DM_Sans',sans-serif] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#F7F5F0] dark:bg-[#0C0C0C] border border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 px-4 py-3 rounded-xl text-sm font-['DM_Sans',sans-serif] outline-none focus:border-black dark:focus:border-gray-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-['DM_Sans',sans-serif] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Choose a strong password"
                className="w-full bg-[#F7F5F0] dark:bg-[#0C0C0C] border border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 px-4 py-3 rounded-xl text-sm font-['DM_Sans',sans-serif] outline-none focus:border-black dark:focus:border-gray-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl text-sm font-['DM_Sans',sans-serif] font-medium hover:opacity-85 transition-opacity disabled:opacity-40 mt-2"
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </div>

          <p className="text-xs font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-600 text-center mt-5">
            By signing up, you agree to our{" "}
            <a href="#" className="underline underline-offset-2">Terms</a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2">Privacy Policy</a>.
          </p>
        </div>

        <p className="text-center mt-6 text-sm font-['DM_Sans',sans-serif] text-gray-400 dark:text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-black dark:text-white font-medium underline underline-offset-2"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
