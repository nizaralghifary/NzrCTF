"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  // const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailOrUsername, setEmailOrUsername] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    let loginEmail = emailOrUsername

    const isEmail = emailOrUsername.includes("@")

    if (!isEmail) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", emailOrUsername.trim())
        .single()

      if (profileError) {
        setError("An error occurred, please try again later")
        setLoading(false)
        return
      }

      if (!profile) {
        setError("Username not found")
        setLoading(false)
        return
      }

      const { data: profileWithEmail } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", emailOrUsername.trim())
        .single()

      if (!profileWithEmail?.email) {
        setError("Username not found")
        setLoading(false)
        return
      }

      loginEmail = profileWithEmail.email
    }

    const { error } = await supabase.auth.signInWithPassword({ 
      email: loginEmail, 
      password 
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#00ff88] tracking-tight font-mono">
            NzrCTF<span className="text-white"> Lab</span>
          </h1>
          <p className="text-[#555570] text-xs mt-1 font-mono">
            CTF Challenge Platform
          </p>
        </div>

        <div className="bg-[#11111a] border border-[#1e1e2e] rounded-lg p-6">
          <h2 className="text-white font-bold text-lg mb-1">Login</h2>
          <p className="text-[#555570] text-xs font-mono mb-6">Log in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#555570] text-xs font-mono uppercase tracking-widest mb-1.5">
                Email or Username
              </label>
              <input
                type="email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                placeholder="hacker@ctf.com or h4ck3r_name"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] text-white font-mono text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all placeholder:text-[#333350]"
              />
            </div>

            <div>
              <label className="block text-[#555570] text-xs font-mono uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] text-white font-mono text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all placeholder:text-[#333350]"
              />
            </div>

            {error && (
              <div className="bg-[#ff3c6e]/10 border border-[#ff3c6e]/30 text-[#ff3c6e] text-xs font-mono px-3 py-2 rounded">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00ff88] text-black font-bold text-sm py-2.5 rounded hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#555570] text-xs font-mono mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#00ff88] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}