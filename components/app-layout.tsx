"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  IconLayoutDashboard,
  IconSparkles,
  IconWorld,
  IconFileCode,
  IconTerminal,
  IconSun,
  IconMoon,
  IconKeyboard
} from "@tabler/icons-react"

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  status: "Active" | "Under Development";
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const navItems: NavItem[] = [
    {
      name: "SEO Content Analyzer",
      href: "/content-analyzer",
      icon: IconSparkles,
      status: "Active"
    },
    {
      name: "Meta Tags Generator",
      href: "/meta-generator",
      icon: IconWorld,
      status: "Under Development"
    },
    {
      name: "Robots & Sitemap",
      href: "/robots-sitemap",
      icon: IconFileCode,
      status: "Under Development"
    },
    {
      name: "Redirect Tracer",
      href: "/redirect-tracer",
      icon: IconTerminal,
      status: "Under Development"
    }
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-4 justify-between select-none">
        <div className="space-y-6">
          
          {/* Logo & Portal Header */}
          <Link 
            href="/"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center justify-center size-8 rounded-md bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              <span className="font-extrabold text-sm">SEO</span>
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight tracking-tight text-foreground">Internal Portal</h1>
              <p className="text-[10px] text-muted-foreground font-medium">Internal Marketing Suite</p>
            </div>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                pathname === "/"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <IconLayoutDashboard className="size-4" />
              <span>Tools Dashboard</span>
            </Link>
            
            <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
              Content Utilities
            </div>

            {navItems.filter(item => item.status === "Active").map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="size-4" />
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
              Technical SEO
            </div>
            
            {navItems.filter(item => item.status !== "Active").map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  pathname === item.href
                    ? "bg-muted/80 text-foreground border border-border/40"
                    : "text-muted-foreground/60 hover:bg-muted/40 hover:text-foreground/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-4 opacity-70" />
                  <span>{item.name.split(" ")[0]}...</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded border border-zinc-500/10 bg-zinc-500/5 text-zinc-500 font-semibold tracking-wide uppercase scale-90">
                  Soon
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4">
          {/* Keyboard Shortcuts Helper */}
          <div className="border-t border-border/60 pt-4 px-2 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
              <IconKeyboard className="size-3.5" /> Keyboard Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[9px] text-muted-foreground font-mono">
              <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1 rounded">
                <span>Run Audit</span>
                <kbd className="px-1 bg-muted border border-border rounded text-[8px] font-bold">⌘↵</kbd>
              </div>
              <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1 rounded">
                <span>Clear</span>
                <kbd className="px-1 bg-muted border border-border rounded text-[8px] font-bold">⌥⌫</kbd>
              </div>
              <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1 rounded">
                <span>Tab 1</span>
                <kbd className="px-1 bg-muted border border-border rounded text-[8px] font-bold">⌥1</kbd>
              </div>
              <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1 rounded">
                <span>Tab 2</span>
                <kbd className="px-1 bg-muted border border-border rounded text-[8px] font-bold">⌥2</kbd>
              </div>
              <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1 rounded col-span-2">
                <span>Copy Report</span>
                <kbd className="px-1 bg-muted border border-border rounded text-[8px] font-bold">⌥C / ⌘⇧C</kbd>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 px-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold block text-foreground">Marketing Ops</span>
                <span className="text-[10px]">Team Portal v0.1.0</span>
              </div>
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Toggle Theme (or press 'd')"
              >
                {resolvedTheme === "dark" ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* TOP COMPACT NAV (mobile header) */}
        <header className="flex md:hidden items-center justify-between h-14 border-b border-border bg-card px-4 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded bg-sky-500 text-white font-bold text-xs">S</div>
            <span className="font-bold text-sm tracking-tight">Marketing Portal</span>
          </Link>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-md bg-muted text-muted-foreground"
          >
            {resolvedTheme === "dark" ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
          </button>
        </header>

        {/* SCROLLABLE CONTENT VIEW */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}
