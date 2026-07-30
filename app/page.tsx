"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  IconSparkles,
  IconTarget,
  IconTemplate,
  IconLock,
  IconMail,
  IconEye,
  IconEyeOff,
  IconUser,
  IconShieldCheck,
  IconCheck,
  IconAlertCircle,
  IconArrowRight,
  IconSun,
  IconMoon,
  IconBrandGoogle,
  IconBrandGithub,
  IconKey,
  IconChevronRight,
  IconLoader2,
  IconHelpCircle,
  IconBuildingSkyscraper,
  IconChecklist
} from "@tabler/icons-react"

export default function LoginPage() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hardcoded Credentials
  const HARDCODED_EMAIL = "admin@seo.com"
  const HARDCODED_PASSWORD = "password123"

  // Auth State
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin")
  const [email, setEmail] = useState("admin@seo.com")
  const [password, setPassword] = useState("password123")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [teamRole, setTeamRole] = useState("SEO Specialist")
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Status & Feedback State
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Handle Form Submission (Sign In)
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const inputEmail = email.trim().toLowerCase()

    if (inputEmail !== HARDCODED_EMAIL || password !== HARDCODED_PASSWORD) {
      setErrorMsg(`Invalid credentials. Please use: ${HARDCODED_EMAIL} / ${HARDCODED_PASSWORD}`)
      return
    }

    setIsLoading(true)
    setLoadingText("Authenticating admin credentials...")

    setTimeout(() => {
      setIsLoading(false)
      setIsAuthenticated(true)
      setUserProfile({
        name: "Admin User",
        email: HARDCODED_EMAIL,
        role: "Lead SEO Administrator"
      })
      setSuccessMsg("Authentication successful! Redirecting to marketing suite...")
      
      // Auto navigate after brief delay
      setTimeout(() => {
        router.push("/content-analyzer")
      }, 1000)
    }, 800)
  }

  // Handle Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.")
      return
    }
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid work email.")
      return
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.")
      return
    }
    if (!termsAccepted) {
      setErrorMsg("Please accept the terms of service to create an account.")
      return
    }

    setIsLoading(true)
    setLoadingText("Creating your internal account...")

    setTimeout(() => {
      setIsLoading(false)
      setMode("signin")
      setSuccessMsg("Account successfully created! You can now sign in with your credentials.")
    }, 1000)
  }

  // Handle Forgot Password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter your registered work email.")
      return
    }

    setIsLoading(true)
    setLoadingText("Sending password reset link...")

    setTimeout(() => {
      setIsLoading(false)
      setSuccessMsg(`Password reset link dispatched to ${email}. Check your inbox.`)
    }, 1000)
  }

  // Quick Demo Login for instant access
  const handleDemoLogin = (role: string = "SEO Administrator") => {
    setErrorMsg(null)
    setEmail(HARDCODED_EMAIL)
    setPassword(HARDCODED_PASSWORD)
    setIsLoading(true)
    setLoadingText(`Initializing session as ${role}...`)

    setTimeout(() => {
      setIsLoading(false)
      setIsAuthenticated(true)
      setUserProfile({
        name: "Admin User",
        email: HARDCODED_EMAIL,
        role: role
      })
      setSuccessMsg("Demo session granted! Launching tools dashboard...")

      setTimeout(() => {
        router.push("/content-analyzer")
      }, 1000)
    }, 800)
  }

  // Social Login Handler
  const handleSocialLogin = (provider: string) => {
    setErrorMsg(null)
    setIsLoading(true)
    setLoadingText(`Connecting to ${provider} SSO...`)

    setTimeout(() => {
      setIsLoading(false)
      setIsAuthenticated(true)
      setUserProfile({
        name: `${provider} Authenticated User`,
        email: `user@${provider.toLowerCase()}.com`,
        role: "Corporate Specialist"
      })
      setSuccessMsg(`Authenticated via ${provider} SSO! Loading suite...`)

      setTimeout(() => {
        router.push("/content-analyzer")
      }, 1000)
    }, 800)
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground transition-colors duration-300">
      
      {/* LEFT PANEL: Branding & Product Showcase (Hidden on small mobile if desired, or top block) */}
      <div className="relative lg:w-7/12 bg-slate-950 text-white p-8 lg:p-14 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        
        {/* Decorative Background Mesh Glows */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-sky-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 size-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 size-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Top Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white font-extrabold text-lg shadow-lg shadow-sky-500/25">
              SEO
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white">Marketing Tools Suite</h1>
              <p className="text-xs text-sky-400 font-medium tracking-wide uppercase">Internal Enterprise Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              v0.1.0 Online
            </span>
          </div>
        </div>

        {/* Center Content / Hero Features */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-semibold">
              <IconSparkles className="size-3.5 text-sky-400" />
              <span>AI-Powered Content & Keyword Audit Platform</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Streamline website optimization with unified internal tools.
            </h2>
            <p className="text-slate-400 text-sm lg:text-base leading-relaxed">
              Audit HTML structures, measure Yoast Flesch readability, identify semantic keyword gaps, and generate automated ChatGPT prompt templates in seconds.
            </p>
          </div>

          {/* Featured Tool Cards Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-sm space-y-2 hover:border-sky-500/40 transition-colors">
              <div className="size-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <IconSparkles className="size-4" />
              </div>
              <h3 className="font-bold text-xs text-white">SEO Analyzer</h3>
              <p className="text-[11px] text-slate-400 leading-snug">HTML audits & readability scoring</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-sm space-y-2 hover:border-sky-500/40 transition-colors">
              <div className="size-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <IconTarget className="size-4" />
              </div>
              <h3 className="font-bold text-xs text-white">Keyword Gap</h3>
              <p className="text-[11px] text-slate-400 leading-snug">Semantic coverage density check</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-sm space-y-2 hover:border-sky-500/40 transition-colors">
              <div className="size-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <IconTemplate className="size-4" />
              </div>
              <h3 className="font-bold text-xs text-white">Template Hub</h3>
              <p className="text-[11px] text-slate-400 leading-snug">ChatGPT prompt & author switcher</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">3</span> Active Utilities
            </div>
            <div className="size-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400">&lt;15ms</span> Latency
            </div>
            <div className="size-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">SOC-2</span> Encrypted
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <IconShieldCheck className="size-4 text-sky-400" />
            <span>Internal Security & Access Control Policy</span>
          </div>
          <span>© 2026 Marketing Ops</span>
        </div>
      </div>


      {/* RIGHT PANEL: Auth Card & Forms */}
      <div className="relative lg:w-5/12 p-6 sm:p-12 lg:p-16 flex flex-col justify-between items-center bg-background">
        
        {/* Top Controls: Theme Switcher & Guest Access */}
        <div className="w-full flex items-center justify-between mb-8">
          <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <IconLock className="size-3.5 text-sky-500" />
            <span>Authorized Personnel Only</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Toggle theme"
            >
              {!mounted ? (
                <div className="size-4" />
              ) : resolvedTheme === "dark" ? (
                <IconSun className="size-4 text-amber-400" />
              ) : (
                <IconMoon className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Main Auth Form Container */}
        <div className="w-full max-w-md space-y-6 my-auto">

          {/* SUCCESS AUTHENTICATED STATE VIEW */}
          {isAuthenticated && userProfile ? (
            <div className="bg-card border border-emerald-500/30 rounded-2xl p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                <IconCheck className="size-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                  Session Granted
                </span>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Welcome, {userProfile.name}!</h3>
                <p className="text-sm text-muted-foreground">
                  Logged in as <span className="font-semibold text-foreground">{userProfile.email}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/60 text-xs text-muted-foreground text-left space-y-2 border border-border/60">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Role:</span>
                  <span>{userProfile.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Permissions:</span>
                  <span className="text-emerald-500 font-semibold">Full Audit Access</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Environment:</span>
                  <span>Internal Ops Production</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => router.push("/content-analyzer")}
                  className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Launch SEO Suite</span>
                  <IconArrowRight className="size-4" />
                </button>

                <button
                  onClick={() => {
                    setIsAuthenticated(false)
                    setSuccessMsg(null)
                  }}
                  className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in with a different account
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* HEADER & TAB SWITCHER */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                    {mode === "signin" && "Sign In to Portal"}
                    {mode === "signup" && "Create Internal Account"}
                    {mode === "forgot" && "Reset Password"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mode === "signin" && "Enter your credentials or use SSO to access internal tools."}
                    {mode === "signup" && "Register a new marketing team member account."}
                    {mode === "forgot" && "Enter your work email to receive password reset instructions."}
                  </p>
                </div>

                {/* Tab Switcher (SignIn vs SignUp) */}
                {mode !== "forgot" && (
                  <div className="grid grid-cols-2 p-1 bg-muted rounded-xl text-xs font-semibold text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin")
                        setErrorMsg(null)
                      }}
                      className={`py-2 rounded-lg transition-all ${
                        mode === "signin"
                          ? "bg-card text-foreground shadow-sm font-bold"
                          : "hover:text-foreground"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup")
                        setErrorMsg(null)
                      }}
                      className={`py-2 rounded-lg transition-all ${
                        mode === "signup"
                          ? "bg-card text-foreground shadow-sm font-bold"
                          : "hover:text-foreground"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>

              {/* MESSAGES & ALERTS */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2.5 animate-in fade-in-50">
                  <IconAlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && !isAuthenticated && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium flex items-start gap-2.5 animate-in fade-in-50">
                  <IconCheck className="size-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* SOCIAL SSO BUTTONS (Only shown on signin mode) */}
              {mode === "signin" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Google")}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors disabled:opacity-50"
                      title="Sign in with Google"
                    >
                      <IconBrandGoogle className="size-4 text-red-500" />
                      <span className="hidden sm:inline">Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("GitHub")}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors disabled:opacity-50"
                      title="Sign in with GitHub"
                    >
                      <IconBrandGithub className="size-4" />
                      <span className="hidden sm:inline">GitHub</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Microsoft")}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors disabled:opacity-50"
                      title="Sign in with Enterprise SSO"
                    >
                      <IconKey className="size-4 text-sky-500" />
                      <span className="hidden sm:inline">SSO</span>
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/80" />
                    </div>
                    <div className="relative px-3 bg-background text-[11px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                      Or work email
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 1: SIGN IN FORM */}
              {mode === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-tight text-foreground flex items-center justify-between">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <IconMail className="size-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold tracking-tight text-foreground">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot")
                          setErrorMsg(null)
                        }}
                        className="text-xs text-sky-500 hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <IconLock className="size-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all placeholder:text-muted-foreground/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-border text-sky-500 focus:ring-sky-500/30 size-4"
                      />
                      <span>Keep me signed in on this browser</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.005] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <IconLoader2 className="size-4 animate-spin" />
                        <span>{loadingText}</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Workspace</span>
                        <IconArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* MODE 2: SIGN UP FORM */}
              {mode === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Full Name</label>
                    <div className="relative">
                      <IconUser className="size-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Work Email</label>
                    <div className="relative">
                      <IconMail className="size-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Confirm</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Team Role</label>
                    <select
                      value={teamRole}
                      onChange={(e) => setTeamRole(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                    >
                      <option value="SEO Specialist">SEO Specialist</option>
                      <option value="Content Strategist">Content Strategist</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Technical Developer">Technical Developer</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-muted-foreground pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-border text-sky-500 focus:ring-sky-500/30 size-4"
                    />
                    <span>
                      I agree to the Internal Security Guidelines and Data Privacy Terms.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <IconLoader2 className="size-4 animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Register Account</span>
                        <IconArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* MODE 3: FORGOT PASSWORD FORM */}
              {mode === "forgot" && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Registered Work Email</label>
                    <div className="relative">
                      <IconMail className="size-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <IconLoader2 className="size-4 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <span>Send Recovery Instructions</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin")
                      setErrorMsg(null)
                    }}
                    className="w-full text-center text-xs font-semibold text-sky-500 hover:underline pt-2"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )}

            </>
          )}

        </div>

        {/* Bottom Help Text */}
        <div className="w-full pt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <IconHelpCircle className="size-3.5" />
          <span>Need access help? Contact your IT administrator.</span>
        </div>

      </div>

    </div>
  )
}
