"use client"

import React from "react"
import Link from "next/link"
import {
  IconLayoutDashboard,
  IconSparkles,
  IconWorld,
  IconFileCode,
  IconTerminal,
  IconChevronRight
} from "@tabler/icons-react"

// Interface for Tool definitions
interface Tool {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Under Development";
  category: "Content" | "Technical" | "Analytics";
  icon: React.ComponentType<any>;
  badgeColor: string;
  href: string;
}

export default function Page() {
  const tools: Tool[] = [
    {
      id: "analyzer",
      name: "SEO Content Analyzer",
      description: "Analyze HTML source to audit word counts, links, image attributes, H2 structures, and Yoast Flesch readability scores.",
      status: "Active",
      category: "Content",
      icon: IconSparkles,
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      href: "/content-analyzer"
    },
    {
      id: "meta-generator",
      name: "Meta Tags Optimizer & Generator",
      description: "Generate and audit website meta tags, social share graphics (Open Graph), and review real-time SERP preview formatting.",
      status: "Under Development",
      category: "Technical",
      icon: IconWorld,
      badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      href: "/meta-generator"
    },
    {
      id: "robots-sitemap",
      name: "Robots.txt & Sitemap Builder",
      description: "Interactively draft compliant robots.txt rules, define sitemap directories, and audit XML structure indexes for search engine crawlers.",
      status: "Under Development",
      category: "Technical",
      icon: IconFileCode,
      badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      href: "/robots-sitemap"
    },
    {
      id: "redirect-tracer",
      name: "HTTP Redirect & Headers Tracer",
      description: "Trace server status codes, redirect hops (301, 302), and inspect secure headers such as CSP and HSTS in real-time.",
      status: "Under Development",
      category: "Technical",
      icon: IconTerminal,
      badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      href: "/redirect-tracer"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      
      {/* Page Title Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight">Marketing Tools Directory</h2>
        <p className="text-sm text-muted-foreground">
          Select a utility from the list below to begin optimizing website properties and structures.
        </p>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Available Tools", value: "4" },
          { label: "Active Utilities", value: "1", color: "text-emerald-500 dark:text-emerald-400" },
          { label: "Under Development", value: "3", color: "text-amber-500 dark:text-amber-400" },
          { label: "Avg Audit Speed", value: "<15ms", color: "text-sky-500 dark:text-sky-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-border/80 transition-colors">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">{stat.label}</span>
            <span className={`text-2xl font-bold tracking-tight block mt-1.5 ${stat.color || ""}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tools Directory Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Utilities Directory</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const isAnalyzer = tool.id === "analyzer";
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 ${
                  isAnalyzer 
                    ? "hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-md hover:shadow-sky-500/5 cursor-pointer" 
                    : "opacity-75 cursor-default hover:border-border/60"
                }`}
              >
                {/* Right side status badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${tool.badgeColor}`}>
                    {tool.status}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Icon Circle */}
                  <div className={`size-11 rounded-xl flex items-center justify-center transition-colors ${
                    isAnalyzer 
                      ? "bg-sky-500/10 text-sky-500 group-hover:bg-sky-500 group-hover:text-white" 
                      : "bg-muted text-muted-foreground/60"
                  }`}>
                    <tool.icon className="size-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                      {tool.name}
                      {isAnalyzer && <IconChevronRight className="size-4 text-sky-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed pr-6">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground font-medium">Category: {tool.category}</span>
                  {isAnalyzer ? (
                    <span className="text-sky-500 group-hover:underline">Launch Tool →</span>
                  ) : (
                    <span className="text-muted-foreground/40 font-medium">Coming Soon</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  )
}
