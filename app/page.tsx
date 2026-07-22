"use client"

import React, { useState, useMemo } from "react"
import { useTheme } from "next-themes"
import { toast, Toaster } from "sonner"
import {
  IconLayoutDashboard,
  IconArrowLeft,
  IconCopy,
  IconCheck,
  IconAlertCircle,
  IconSearch,
  IconWorld,
  IconChevronRight,
  IconPhoto,
  IconLink,
  IconFileCode,
  IconSparkles,
  IconCircleCheck,
  IconCircleX,
  IconSun,
  IconMoon,
  IconTerminal,
  IconPlus,
  IconExternalLink,
  IconBook,
  IconFilter
} from "@tabler/icons-react"
import { runSeoAudit, generateProgrammaticReport, type AuditResults, type HeadingData, type ImageData, type LinkData } from "@/lib/seo-analyzer"

// Interface for Tool definitions
interface Tool {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Under Development";
  category: "Content" | "Technical" | "Analytics";
  icon: React.ComponentType<any>;
  badgeColor: string;
}

export default function Page() {
  const { resolvedTheme, setTheme } = useTheme()
  const [currentView, setCurrentView] = useState<"landing" | "analyzer">("landing")
  
  // SEO Content Analyzer Form States
  const [htmlInput, setHtmlInput] = useState<string>("")
  const [keywordsRaw, setKeywordsRaw] = useState<string>("")
  const [centerClass, setCenterClass] = useState<string>("has-text-align-center")
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null)
  const [activeTab, setActiveTab] = useState<"summary" | "python-report">("summary")

  // Element Filters for Detail Lists
  const [h2Filter, setH2Filter] = useState<string>("")
  const [linkFilter, setLinkFilter] = useState<string>("")
  const [imageFilter, setImageFilter] = useState<string>("")

  // Available SEO tools
  const tools: Tool[] = [
    {
      id: "analyzer",
      name: "SEO Content Analyzer",
      description: "Analyze HTML source to audit word counts, links, image attributes, H2 structures, and Yoast Flesch readability scores.",
      status: "Active",
      category: "Content",
      icon: IconSparkles,
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20"
    },
    {
      id: "meta-generator",
      name: "Meta Tags Optimizer & Generator",
      description: "Generate and audit website meta tags, social share graphics (Open Graph), and review real-time SERP preview formatting.",
      status: "Under Development",
      category: "Technical",
      icon: IconWorld,
      badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    },
    {
      id: "robots-sitemap",
      name: "Robots.txt & Sitemap Builder",
      description: "Interactively draft compliant robots.txt rules, define sitemap directories, and audit XML structure indexes for search engine crawlers.",
      status: "Under Development",
      category: "Technical",
      icon: IconFileCode,
      badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    },
    {
      id: "redirect-tracer",
      name: "HTTP Redirect & Headers Tracer",
      description: "Trace server status codes, redirect hops (301, 302), and inspect secure headers such as CSP and HSTS in real-time.",
      status: "Under Development",
      category: "Technical",
      icon: IconTerminal,
      badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    }
  ]

  // Keywords computed helper
  const keywordsList = useMemo(() => {
    if (!keywordsRaw.trim()) return [];
    return keywordsRaw
      .split(/[,\n]/)
      .map(k => k.trim())
      .filter(k => k.length > 0);
  }, [keywordsRaw]);

  // Execute Analysis handler
  const handleAnalyze = () => {
    if (!htmlInput.trim()) {
      toast.error("Please paste your HTML content first.");
      return;
    }
    
    try {
      const results = runSeoAudit(htmlInput, keywordsList, centerClass);
      setAuditResults(results);
      toast.success("SEO Audit completed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to parse HTML code. Please check that it is valid.");
    }
  }

  // Copy Programmatic Report handler
  const handleCopyReport = (reportText: string) => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText);
    toast.success("Audit report copied to clipboard!");
  }

  // Filter H2 headings
  const filteredH2s = useMemo(() => {
    if (!auditResults) return [];
    return auditResults.headings.all.filter(h =>
      h.text.toLowerCase().includes(h2Filter.toLowerCase())
    );
  }, [auditResults, h2Filter]);

  // Filter Links
  const filteredLinks = useMemo(() => {
    if (!auditResults) return [];
    return auditResults.links.all.filter(l =>
      l.anchorText.toLowerCase().includes(linkFilter.toLowerCase()) ||
      l.href.toLowerCase().includes(linkFilter.toLowerCase())
    );
  }, [auditResults, linkFilter]);

  // Filter Images
  const filteredImages = useMemo(() => {
    if (!auditResults) return [];
    return auditResults.images.all.filter(img =>
      img.filename.toLowerCase().includes(imageFilter.toLowerCase()) ||
      img.alt.toLowerCase().includes(imageFilter.toLowerCase()) ||
      img.title.toLowerCase().includes(imageFilter.toLowerCase())
    );
  }, [auditResults, imageFilter]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-4 justify-between select-none">
        <div className="space-y-6">
          {/* Logo & Portal Header */}
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20">
            <div className="flex items-center justify-center size-8 rounded-md bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              <span className="font-extrabold text-sm">SEO</span>
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight tracking-tight">Internal Portal</h1>
              <p className="text-[10px] text-muted-foreground font-medium">Internal Marketing Suite</p>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView("landing")}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                currentView === "landing"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <IconLayoutDashboard className="size-4" />
              <span>Tools Dashboard</span>
            </button>
            
            <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
              Content Utilities
            </div>

            <button
              onClick={() => setCurrentView("analyzer")}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                currentView === "analyzer"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <IconSparkles className="size-4" />
              <span>Content Analyzer</span>
            </button>

            <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
              Technical SEO
            </div>
            
            {tools.filter(t => t.id !== "analyzer").map(tool => (
              <div
                key={tool.id}
                className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground/50 cursor-not-allowed select-none"
              >
                <div className="flex items-center gap-3">
                  <tool.icon className="size-4 opacity-50" />
                  <span>{tool.name.split(" ")[0]}...</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded border border-zinc-500/10 bg-zinc-500/5 text-zinc-500 font-semibold tracking-wide uppercase scale-90">
                  Soon
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4">
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
        {/* TOP COMPACT NAV (mainly for mobile or quick actions) */}
        <header className="flex md:hidden items-center justify-between h-14 border-b border-border bg-card px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded bg-sky-500 text-white font-bold text-xs">S</div>
            <span className="font-bold text-sm tracking-tight">Marketing Portal</span>
          </div>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-md bg-muted text-muted-foreground"
          >
            {resolvedTheme === "dark" ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
          </button>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          
          {/* VIEW: LANDING PAGE */}
          {currentView === "landing" && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
              
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
                <h3 className="text-xl font-bold tracking-tight">Active Tools Directory</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tools.map((tool) => {
                    const isAnalyzer = tool.id === "analyzer";
                    return (
                      <div
                        key={tool.id}
                        onClick={() => isAnalyzer && setCurrentView("analyzer")}
                        className={`group relative bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 ${
                          isAnalyzer 
                            ? "hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-md hover:shadow-sky-500/5 cursor-pointer" 
                            : "opacity-75 cursor-not-allowed select-none"
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
                            <span className="text-muted-foreground/40 font-medium">Locked</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* VIEW: CONTENT ANALYZER WORKSPACE */}
          {currentView === "analyzer" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
              
              {/* Header Action Nav */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-1">
                  <button
                    onClick={() => setCurrentView("landing")}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold mb-1"
                  >
                    <IconArrowLeft className="size-3.5" /> Back to Dashboard
                  </button>
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    ⚡ SEO Content Analyzer
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Runs Flesch Reading Ease calculations and validates headings, images, and anchors programmatically.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 sm:self-end">
                  <button
                    onClick={() => {
                      setHtmlInput("");
                      setKeywordsRaw("");
                      setAuditResults(null);
                      toast.info("Workspace cleared.");
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Clear Work
                  </button>
                  <button
                    onClick={handleAnalyze}
                    className="px-4 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow-sm shadow-sky-500/10 transition-colors"
                  >
                    🔍 Run Analysis
                  </button>
                </div>
              </div>

              {/* INPUT PANEL & SETTINGS SPLIT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* HTML Paste Box */}
                <div className="lg:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-foreground tracking-wide uppercase block">
                    📥 Paste Webpage HTML Code Here:
                  </label>
                  <textarea
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder="<html>
<body>
  <h1>Interactive SEO Blog Post</h1>
  <p>Paste the full HTML markup here to audit...</p>
</body>
</html>"
                    className="w-full h-80 rounded-xl border border-border bg-card p-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 resize-none transition-shadow"
                  />
                </div>

                {/* Settings Column */}
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold tracking-tight border-b border-border pb-2 text-foreground">
                      ⚙️ Audit Parameters
                    </h3>

                    {/* Target Keywords Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground block">
                        🏷️ Target Keywords
                      </label>
                      <textarea
                        value={keywordsRaw}
                        onChange={(e) => setKeywordsRaw(e.target.value)}
                        placeholder="e.g. SEO tools, readability, audit"
                        className="w-full h-24 rounded-lg border border-border bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 resize-none"
                      />
                      <span className="text-[10px] text-muted-foreground leading-tight block">
                        Enter keywords separated by commas or lines.
                      </span>
                    </div>

                    {/* H2 Class Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground block">
                        📋 H2 Centering CSS Class
                      </label>
                      <input
                        type="text"
                        value={centerClass}
                        onChange={(e) => setCenterClass(e.target.value)}
                        placeholder="has-text-align-center"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      />
                      <span className="text-[10px] text-muted-foreground leading-tight block">
                        Checks if H2s contain this class (standard for WordPress blocks).
                      </span>
                    </div>

                    {/* Quick Helper Tip */}
                    <div className="rounded-lg bg-sky-500/5 border border-sky-500/10 p-3 flex items-start gap-2.5">
                      <IconBook className="size-4.5 text-sky-500 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-muted-foreground leading-normal">
                        <span className="font-bold text-foreground block">Yoast grading algorithm</span>
                        The analyzer tests grade difficulty based on English text metrics. Recommended score is 60+ (Standard).
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* REPORT & DASHBOARD WORKSPACE */}
              {auditResults ? (
                <div className="space-y-6 animate-in fade-in-50 duration-500">
                  
                  {/* Workspace Tabs Navigation */}
                  <div className="flex border-b border-border">
                    <button
                      onClick={() => setActiveTab("summary")}
                      className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                        activeTab === "summary"
                          ? "border-sky-500 text-sky-500 font-bold"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      📊 Summary Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab("python-report")}
                      className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                        activeTab === "python-report"
                          ? "border-sky-500 text-sky-500 font-bold"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      🐍 Python Programmatic Audit
                    </button>
                  </div>

                  {/* TAB 1: SUMMARY DASHBOARD */}
                  {activeTab === "summary" && (
                    <div className="space-y-6">
                      
                      {/* Metric Badges */}
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                          { label: "Word Count", value: auditResults.totalWords, color: "text-foreground" },
                          { 
                            label: "Flesch Readability", 
                            value: auditResults.readabilityScore.toFixed(1),
                            color: auditResults.readabilityColor === "good" 
                              ? "text-emerald-500 dark:text-emerald-400" 
                              : (auditResults.readabilityColor === "warning" 
                                ? "text-amber-500 dark:text-amber-400" 
                                : "text-rose-500 dark:text-rose-400")
                          },
                          { 
                            label: "Link Compliance", 
                            value: `${auditResults.links.blankPct.toFixed(0)}%`,
                            color: auditResults.links.blankPct === 100 
                              ? "text-emerald-500 dark:text-emerald-400" 
                              : "text-amber-500 dark:text-amber-400" 
                          },
                          { 
                            label: "Image Compliance", 
                            value: `${auditResults.images.compliancePct.toFixed(0)}%`,
                            color: auditResults.images.compliancePct === 100
                              ? "text-emerald-500 dark:text-emerald-400"
                              : (auditResults.images.compliancePct > 0 
                                ? "text-amber-500 dark:text-amber-400" 
                                : "text-rose-500 dark:text-rose-400")
                          },
                          { label: "H2 Headings", value: auditResults.headings.all.length, color: "text-foreground" },
                        ].map((metric, i) => (
                          <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-border/80 transition-colors">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                              {metric.label}
                            </span>
                            <span className={`text-2xl font-extrabold mt-1.5 block ${metric.color}`}>
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-muted/40 border border-border/80 rounded-xl p-4 text-xs md:text-sm text-foreground flex items-center gap-2">
                        <IconBook className="size-5 text-sky-500 shrink-0" />
                        <span>
                          <strong className="font-semibold text-foreground">Yoast Readability Analysis:</strong> {auditResults.readabilityDesc}
                        </span>
                      </div>

                      {/* Split Summary Cards */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Keyword Density Table */}
                        <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-bold tracking-tight text-foreground border-b border-border pb-2 flex items-center justify-between">
                              <span>🔑 Target Keyword Density</span>
                              <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                {keywordsList.length} defined
                              </span>
                            </h3>
                            
                            {keywordsList.length > 0 ? (
                              <div className="overflow-x-auto mt-3">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="border-b border-border text-muted-foreground font-semibold">
                                      <th className="py-2 pr-4">Keyword</th>
                                      <th className="py-2 px-2 text-center">Occurrences (Text)</th>
                                      <th className="py-2 px-2 text-center">Density (%)</th>
                                      <th className="py-2 pl-4 text-right">Occurrences (HTML)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border/60">
                                    {Object.entries(auditResults.keywords).map(([kw, counts]) => {
                                      const density = auditResults.totalWords > 0 
                                        ? (counts.inTextWords / auditResults.totalWords) * 100 
                                        : 0;
                                      return (
                                        <tr key={kw} className="hover:bg-muted/30">
                                          <td className="py-2.5 pr-4 font-semibold text-foreground truncate max-w-[120px]" title={kw}>
                                            {kw}
                                          </td>
                                          <td className="py-2.5 px-2 text-center font-medium">
                                            {counts.inTextWords}
                                          </td>
                                          <td className="py-2.5 px-2 text-center font-medium">
                                            <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                              density > 2.5 
                                                ? "bg-rose-500/10 text-rose-500" 
                                                : (density >= 0.5 
                                                  ? "bg-emerald-500/10 text-emerald-500" 
                                                  : "bg-amber-500/10 text-amber-500")
                                            }`}>
                                              {density.toFixed(2)}%
                                            </span>
                                          </td>
                                          <td className="py-2.5 pl-4 text-right text-muted-foreground font-mono">
                                            {counts.inHtml}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="py-8 text-center text-xs text-muted-foreground">
                                No keywords defined. Add keywords in the settings box to verify usage.
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground flex justify-between">
                            <span>* Optimal SEO density is between 0.5% - 2.5%</span>
                            <span>Text occurrences use word-boundary matching</span>
                          </div>
                        </div>

                        {/* Audit Checklist Flags */}
                        <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
                          <h3 className="text-sm font-bold tracking-tight text-foreground border-b border-border pb-2">
                            ⚠️ Key Audit Checklist Flags
                          </h3>

                          <div className="space-y-3.5 mt-3 text-xs md:text-sm">
                            {/* Heading Centering Check */}
                            <div className="flex items-start gap-3">
                              {auditResults.headings.all.length > 0 && auditResults.headings.centeredCount === auditResults.headings.all.length ? (
                                <IconCircleCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                <IconCircleX className="size-5 text-rose-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5">
                                <span className="font-semibold block">H2 Centering Match</span>
                                {auditResults.headings.all.length > 0 ? (
                                  auditResults.headings.centeredCount === auditResults.headings.all.length ? (
                                    <span className="text-xs text-muted-foreground">All headings are centered with class `{centerClass}`.</span>
                                  ) : (
                                    <span className="text-xs text-rose-500">Only {auditResults.headings.centeredCount}/{auditResults.headings.all.length} H2 tags are center-aligned.</span>
                                  )
                                ) : (
                                  <span className="text-xs text-rose-500">No H2 tags found in the content.</span>
                                )}
                              </div>
                            </div>

                            {/* First H2 Keyword Check */}
                            <div className="flex items-start gap-3">
                              {auditResults.headings.all.length > 0 && auditResults.headings.firstH2HasKeyword ? (
                                <IconCircleCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                <IconCircleX className="size-5 text-rose-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5">
                                <span className="font-semibold block">First H2 Heading Keyword</span>
                                {auditResults.headings.all.length > 0 ? (
                                  auditResults.headings.firstH2HasKeyword ? (
                                    <span className="text-xs text-muted-foreground">Matched: `{auditResults.headings.firstH2Matched.join(', ')}`.</span>
                                  ) : (
                                    <span className="text-xs text-rose-500">The first H2 does not contain any target keywords.</span>
                                  )
                                ) : (
                                  <span className="text-xs text-rose-500">N/A (No H2 headings available in content).</span>
                                )}
                              </div>
                            </div>

                            {/* Link target="_blank" check */}
                            <div className="flex items-start gap-3">
                              {auditResults.links.failed.length === 0 ? (
                                <IconCircleCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                <IconCircleX className="size-5 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-0.5">
                                <span className="font-semibold block">Link Target Compliance</span>
                                {auditResults.links.failed.length === 0 ? (
                                  <span className="text-xs text-muted-foreground">All links have `target="_blank"` and open in a new tab.</span>
                                ) : (
                                  <span className="text-xs text-amber-500">{auditResults.links.failed.length} link(s) do not open in a new tab.</span>
                                )}
                              </div>
                            </div>

                            {/* Image Alt/Title check */}
                            <div className="flex items-start gap-3">
                              {auditResults.images.all.length > 0 && auditResults.images.missingCount === 0 ? (
                                <IconCircleCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                <IconCircleX className={`size-5 shrink-0 mt-0.5 ${auditResults.images.all.length === 0 ? "text-rose-500" : "text-amber-500"}`} />
                              )}
                              <div className="space-y-0.5">
                                <span className="font-semibold block">Image Alt & Title Compliance</span>
                                {auditResults.images.all.length > 0 ? (
                                  auditResults.images.missingCount === 0 ? (
                                    <span className="text-xs text-muted-foreground">All images contain both alt and title tags.</span>
                                  ) : (
                                    <span className="text-xs text-amber-500">{auditResults.images.missingCount} image attributes missing/empty.</span>
                                  )
                                ) : (
                                  <span className="text-xs text-rose-500">No images found in the document.</span>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>

                      {/* Detailed Page Elements Accordion lists */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-tight text-foreground">
                          🔍 Extracted Page Elements Detail
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* HEADINGS DETAIL */}
                          <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 flex flex-col justify-between h-[450px]">
                            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                              <div className="flex items-center justify-between border-b border-border pb-2">
                                <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                                  <IconBook className="size-4 text-sky-500" /> H2 Headings ({auditResults.headings.all.length})
                                </h4>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {auditResults.headings.centeredCount} Centered
                                </span>
                              </div>

                              <div className="relative">
                                <input
                                  type="text"
                                  value={h2Filter}
                                  onChange={(e) => setH2Filter(e.target.value)}
                                  placeholder="Filter headings..."
                                  className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none"
                                />
                                <IconSearch className="size-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                              </div>

                              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                                {filteredH2s.length > 0 ? (
                                  filteredH2s.map((h2, idx) => (
                                    <div key={idx} className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs space-y-1">
                                      <span className="font-semibold text-foreground leading-normal block">
                                        {idx + 1}. {h2.text}
                                      </span>
                                      <div className="flex items-center justify-between text-[10px]">
                                        <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                          h2.isCentered 
                                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                        }`}>
                                          {h2.isCentered ? "Centered" : "Left/Right"}
                                        </span>
                                        {h2.classes.length > 0 && (
                                          <span className="text-muted-foreground truncate max-w-[120px] font-mono text-[9px]" title={h2.classes.join(', ')}>
                                            class: {h2.classes[0]}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-8 text-center text-xs text-muted-foreground">
                                    No matching headings.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* LINKS DETAIL */}
                          <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 flex flex-col justify-between h-[450px]">
                            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                              <div className="flex items-center justify-between border-b border-border pb-2">
                                <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                                  <IconLink className="size-4 text-sky-500" /> Links & Anchor Texts ({auditResults.links.all.length})
                                </h4>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {auditResults.links.all.length - auditResults.links.failed.length} Blank
                                </span>
                              </div>

                              <div className="relative">
                                <input
                                  type="text"
                                  value={linkFilter}
                                  onChange={(e) => setLinkFilter(e.target.value)}
                                  placeholder="Filter links..."
                                  className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none"
                                />
                                <IconSearch className="size-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                              </div>

                              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                                {filteredLinks.length > 0 ? (
                                  filteredLinks.map((link, idx) => (
                                    <div key={idx} className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs space-y-1.5">
                                      <span className="font-semibold text-foreground leading-normal block">
                                        {idx + 1}. "{link.anchorText}"
                                      </span>
                                      <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sky-500 hover:underline flex items-center gap-1 text-[10px] font-mono truncate"
                                      >
                                        URL: {link.href} <IconExternalLink className="size-2.5 shrink-0" />
                                      </a>
                                      <div className="flex items-center justify-between text-[10px] pt-1">
                                        <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                          link.opensNewTab 
                                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                        }`}>
                                          {link.opensNewTab ? "New Tab" : "Same Tab"}
                                        </span>
                                        {link.target && (
                                          <span className="text-muted-foreground font-mono text-[9px]">
                                            target: {link.target}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-8 text-center text-xs text-muted-foreground">
                                    No matching links.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* IMAGES DETAIL */}
                          <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 flex flex-col justify-between h-[450px]">
                            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                              <div className="flex items-center justify-between border-b border-border pb-2">
                                <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                                  <IconPhoto className="size-4 text-sky-500" /> Images Alt/Title ({auditResults.images.all.length})
                                </h4>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {auditResults.images.missingCount} Missing
                                </span>
                              </div>

                              <div className="relative">
                                <input
                                  type="text"
                                  value={imageFilter}
                                  onChange={(e) => setImageFilter(e.target.value)}
                                  placeholder="Filter images..."
                                  className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none"
                                />
                                <IconSearch className="size-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                              </div>

                              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                                {filteredImages.length > 0 ? (
                                  filteredImages.map((img, idx) => (
                                    <div key={idx} className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs space-y-1.5">
                                      <span className="font-semibold text-foreground leading-normal block truncate" title={img.filename}>
                                        {idx + 1}. {img.filename}
                                      </span>
                                      
                                      <div className="space-y-1 text-[11px] border-t border-border/20 pt-1.5">
                                        <div className="flex items-start gap-1 justify-between">
                                          <span className="text-muted-foreground">Alt:</span>
                                          <span className={`font-mono truncate max-w-[150px] ${img.hasAlt ? "text-foreground font-semibold" : "text-rose-500 font-bold"}`}>
                                            {img.alt}
                                          </span>
                                        </div>
                                        <div className="flex items-start gap-1 justify-between">
                                          <span className="text-muted-foreground">Title:</span>
                                          <span className={`font-mono truncate max-w-[150px] ${img.hasTitle ? "text-foreground font-semibold" : "text-rose-500 font-bold"}`}>
                                            {img.title}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex gap-1.5 pt-1">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                          img.hasAlt ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                        }`}>
                                          Alt: {img.hasAlt ? "OK" : "MISSING"}
                                        </span>
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                          img.hasTitle ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                        }`}>
                                          Title: {img.hasTitle ? "OK" : "MISSING"}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-8 text-center text-xs text-muted-foreground">
                                    No matching images.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: PYTHON PROGRAMMATIC AUDIT */}
                  {activeTab === "python-report" && (
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm animate-in fade-in-50 duration-300">
                      
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div>
                          <h3 className="text-sm font-bold tracking-tight text-foreground">
                            📄 Programmatic Audit Output
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            This report format matches the Streamlit terminal script outputs exactly.
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyReport(generateProgrammaticReport(auditResults, centerClass))}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                          <IconCopy className="size-3.5" /> Copy Report
                        </button>
                      </div>

                      <div className="bg-muted/60 rounded-lg p-4 border border-border/80 max-h-[500px] overflow-y-auto font-mono text-xs text-foreground select-text whitespace-pre-wrap">
                        {generateProgrammaticReport(auditResults, centerClass)}
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground space-y-2 shadow-sm animate-in fade-in-50 duration-300">
                  <span className="text-4xl">📥</span>
                  <h4 className="text-sm font-bold text-foreground tracking-tight">Waiting for Analysis...</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Paste your blog post's HTML in the editor box above and click the "Run Analysis" button to view compliance metrics.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  )
}
