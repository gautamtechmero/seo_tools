"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import {
  IconArrowLeft,
  IconCopy,
  IconSearch,
  IconPhoto,
  IconLink,
  IconSparkles,
  IconCircleCheck,
  IconCircleX,
  IconBook,
  IconExternalLink,
  IconFileCode,
  IconSettings,
  IconBolt,
  IconTag,
  IconClipboard,
  IconChartBar,
  IconBrandPython,
  IconKey,
  IconAlertTriangle,
  IconInbox
} from "@tabler/icons-react"
import { runSeoAudit, generateProgrammaticReport, type AuditResults } from "@/lib/seo-analyzer"

export default function ContentAnalyzerPage() {
  // Form States
  const [htmlInput, setHtmlInput] = useState<string>("")
  const [keywordsRaw, setKeywordsRaw] = useState<string>("")
  const [centerClass, setCenterClass] = useState<string>("has-text-align-center")
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null)
  const [activeTab, setActiveTab] = useState<"summary" | "python-report">("summary")

  // Element Filters for Detail Lists
  const [h2Filter, setH2Filter] = useState<string>("")
  const [linkFilter, setLinkFilter] = useState<string>("")
  const [imageFilter, setImageFilter] = useState<string>("")

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

  // Keyboard Shortcuts Hook
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 1. Run Analysis: Cmd+Enter or Ctrl+Enter (always allowed, even inside textarea)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleAnalyze();
      }

      // Check if user is typing in an input element
      const target = e.target;
      const isTyping = target instanceof HTMLElement && (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      );

      // Keyboard shortcuts allowed only when NOT typing in an input (except for Cmd+Enter)
      if (!isTyping) {
        // 2. Switch to Tab 1: Alt + 1
        if (e.altKey && e.key === "1") {
          e.preventDefault();
          setActiveTab("summary");
          toast.info("Switched to Summary Dashboard");
        }
        // 3. Switch to Tab 2: Alt + 2
        if (e.altKey && e.key === "2") {
          e.preventDefault();
          setActiveTab("python-report");
          toast.info("Switched to Programmatic Report");
        }
        // 4. Copy Report: Alt + C or Cmd + Shift + C (if results exist)
        if (auditResults && (
          (e.altKey && e.key.toLowerCase() === "c") ||
          ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "c")
        )) {
          e.preventDefault();
          const report = generateProgrammaticReport(auditResults, centerClass);
          navigator.clipboard.writeText(report);
          toast.success("Audit report copied to clipboard!");
        }
        // 5. Clear Work: Alt + Backspace or Alt + X
        if (e.altKey && (e.key === "Backspace" || e.key.toLowerCase() === "x")) {
          e.preventDefault();
          setHtmlInput("");
          setKeywordsRaw("");
          setAuditResults(null);
          toast.info("Workspace cleared.");
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [htmlInput, keywordsRaw, centerClass, auditResults]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      <Toaster position="top-right" />
      
      {/* Header Action Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold mb-1"
          >
            <IconArrowLeft className="size-3.5" /> Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <IconBolt className="size-6 text-amber-500 fill-amber-500" /> SEO Content Analyzer
          </h2>
          <p className="text-xs text-muted-foreground">
            Runs Flesch Reading Ease calculations and validates headings, images, and anchors programmatically.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
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
            Run Analysis
          </button>
        </div>
      </div>

      {/* INPUT PANEL & SETTINGS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* HTML Paste Box */}
        <div className="lg:col-span-2 flex flex-col space-y-2">
          <label className="text-xs font-bold text-foreground tracking-wide uppercase block">
            Paste Webpage HTML Code:
          </label>
          
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
              <span className="text-[10px] font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <IconFileCode className="size-4 text-sky-500" /> HTML Source Editor
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {htmlInput.length} chars
              </span>
            </div>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="<html>
<body>
  <h1>Interactive SEO Blog Post</h1>
  <p>Paste the full HTML markup here to audit...</p>
</body>
</html>"
              className="w-full h-80 lg:h-[350px] border-0 bg-transparent p-4 text-xs font-mono focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Settings Column */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-tight border-b border-border pb-2 text-foreground flex items-center gap-1.5 uppercase">
                <IconSettings className="size-4 text-sky-500" /> Audit Settings
              </h3>

              {/* Target Keywords Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <IconTag className="size-3.5" /> Target Keywords
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
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <IconClipboard className="size-3.5" /> H2 Centering CSS Class
                </label>
                <input
                  type="text"
                  value={centerClass}
                  onChange={(e) => setCenterClass(e.target.value)}
                  placeholder="has-text-align-center"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                />
                <span className="text-[10px] text-muted-foreground leading-tight block">
                  Defaults to WP block editor class.
                </span>
              </div>
            </div>

            {/* Quick Helper Tip */}
            <div className="rounded-lg bg-sky-500/5 border border-sky-500/10 p-3 flex items-start gap-2.5 mt-4">
              <IconBook className="size-5 text-sky-500 shrink-0" />
              <div className="text-[11px] text-muted-foreground leading-normal">
                <span className="font-bold text-foreground block">Flesch Readability</span>
                Measures paragraph grade ease. Target score is 60+ (Standard English).
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
              <span className="flex items-center gap-1.5"><IconChartBar className="size-4" /> Summary Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("python-report")}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "python-report"
                  ? "border-sky-500 text-sky-500 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-1.5"><IconBrandPython className="size-4" /> Python Programmatic Audit</span>
            </button>
          </div>

          {/* TAB 1: SUMMARY DASHBOARD */}
          {activeTab === "summary" && (
            <div className="space-y-6">
              
              {/* Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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
                      <span className="flex items-center gap-1.5"><IconKey className="size-4 text-sky-500" /> Target Keyword Density</span>
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
                  <h3 className="text-sm font-bold tracking-tight text-foreground border-b border-border pb-2 flex items-center gap-1.5">
                    <IconAlertTriangle className="size-4 text-sky-500" /> Key Audit Checklist Flags
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* HEADINGS DETAIL */}
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 flex flex-col justify-between h-[450px]">
                    <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5 font-sans">
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
                        <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5 font-sans">
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
                                className="text-sky-500 hover:underline flex items-center gap-1 text-[10px] font-mono break-all leading-normal"
                              >
                                URL: {link.href} <IconExternalLink className="size-2.5 shrink-0 inline" />
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
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 flex flex-col justify-between h-[450px] md:col-span-2 lg:col-span-1">
                    <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5 font-sans">
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
                                  <span className="text-muted-foreground shrink-0">Alt:</span>
                                  <span className={`font-mono text-right break-all ml-4 ${img.hasAlt ? "text-foreground font-semibold" : "text-rose-500 font-bold"}`}>
                                    {img.alt}
                                  </span>
                                </div>
                                <div className="flex items-start gap-1 justify-between">
                                  <span className="text-muted-foreground shrink-0">Title:</span>
                                  <span className={`font-mono text-right break-all ml-4 ${img.hasTitle ? "text-foreground font-semibold" : "text-rose-500 font-bold"}`}>
                                    {img.title}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
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
                  <h3 className="text-sm font-bold tracking-tight text-foreground font-sans">
                    📄 Programmatic Audit Output
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    This report format matches the Streamlit terminal script outputs exactly.
                  </p>
                </div>
                <button
                  onClick={() => handleCopyReport(generateProgrammaticReport(auditResults, centerClass))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-sm shadow-sky-500/10"
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
        <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground space-y-4 shadow-sm animate-in fade-in-50 duration-300 flex flex-col items-center justify-center">
          <IconInbox className="size-10 text-muted-foreground/60" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground tracking-tight">Waiting for Analysis...</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Paste your blog post's HTML in the editor box above and click the "Run Analysis" button to view compliance metrics.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
