"use client"

import React from "react"
import Link from "next/link"
import { IconArrowLeft, IconTerminal } from "@tabler/icons-react"

export default function RedirectTracerPlaceholder() {
  return (
    <div className="max-w-xl mx-auto py-12 space-y-6 text-center animate-in fade-in-50 duration-300">
      
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center space-y-5">
        
        {/* Icon Circle */}
        <div className="size-16 rounded-2xl bg-zinc-500/10 text-zinc-400 flex items-center justify-center border border-zinc-500/10">
          <IconTerminal className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
            Under Development
          </span>
          <h2 className="text-xl font-bold tracking-tight">HTTP Redirect & Headers Tracer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Audit server status codes (301, 302, 404, 500), map redirect hops, and verify HTTP security header presence.
          </p>
        </div>

        <div className="pt-4 w-full">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl shadow-sm transition-colors w-full"
          >
            <IconArrowLeft className="size-4" /> Back to Dashboard
          </Link>
        </div>

      </div>

    </div>
  )
}
