"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import {
  IconArrowLeft,
  IconCopy,
  IconCheck,
  IconSearch,
  IconTarget,
  IconKey,
  IconFileText,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconSparkles,
  IconRefresh,
  IconEye,
  IconListCheck
} from "@tabler/icons-react"

interface KeywordStat {
  keyword: string
  found: boolean
  count: number
  density: number
}

export default function KeywordAnalyzerPage() {
  // Container 1: Content Text
  const [content, setContent] = useState<string>("")
  
  // Container 2: Target Semantic Keywords
  const [semanticKeywordsRaw, setSemanticKeywordsRaw] = useState<string>("")

  // Analysis Options
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
  const [wholeWordMatch, setWholeWordMatch] = useState<boolean>(true)
  
  // Filter for Keyword Results Table
  const [tableFilter, setTableFilter] = useState<string>("")

  // Copy States
  const [copiedMissing, setCopiedMissing] = useState<boolean>(false)
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false)

  // Parse raw keywords input into distinct array
  const targetKeywords = useMemo(() => {
    if (!semanticKeywordsRaw.trim()) return []
    const list = semanticKeywordsRaw
      .split(/[\n,]/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
    // Remove duplicates while keeping case if needed
    return Array.from(new Set(list))
  }, [semanticKeywordsRaw])

  // Total Content Word Count
  const totalContentWords = useMemo(() => {
    if (!content.trim()) return 0
    return content.trim().split(/\s+/).length
  }, [content])

  // Perform Analysis
  const analysisResults = useMemo(() => {
    if (!content.trim() || targetKeywords.length === 0) {
      return {
        keywordStats: [] as KeywordStat[],
        foundCount: 0,
        missingCount: 0,
        coveragePct: 0,
        missingList: [] as string[],
        foundList: [] as string[]
      }
    }

    const textToSearch = caseSensitive ? content : content.toLowerCase()

    let foundCount = 0
    let missingCount = 0
    const missingList: string[] = []
    const foundList: string[] = []

    const keywordStats: KeywordStat[] = targetKeywords.map((kw) => {
      const searchTerm = caseSensitive ? kw : kw.toLowerCase()

      let occurrences = 0
      if (wholeWordMatch) {
        // Escape special regex characters in keyword
        const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        // Word boundary regex matching
        const regex = new RegExp(`\\b${escaped}\\b`, caseSensitive ? "g" : "gi")
        const matches = content.match(regex)
        occurrences = matches ? matches.length : 0
      } else {
        // Partial string matching count
        let pos = 0
        while ((pos = textToSearch.indexOf(searchTerm, pos)) !== -1) {
          occurrences++
          pos += searchTerm.length
        }
      }

      const isFound = occurrences > 0
      if (isFound) {
        foundCount++
        foundList.push(kw)
      } else {
        missingCount++
        missingList.push(kw)
      }

      const density = totalContentWords > 0 ? (occurrences / totalContentWords) * 100 : 0

      return {
        keyword: kw,
        found: isFound,
        count: occurrences,
        density
      }
    })

    const coveragePct = targetKeywords.length > 0 ? (foundCount / targetKeywords.length) * 100 : 0

    return {
      keywordStats,
      foundCount,
      missingCount,
      coveragePct,
      missingList,
      foundList
    }
  }, [content, targetKeywords, caseSensitive, wholeWordMatch, totalContentWords])

  // Filtered Table Stats
  const filteredKeywordStats = useMemo(() => {
    if (!tableFilter.trim()) return analysisResults.keywordStats
    return analysisResults.keywordStats.filter((stat) =>
      stat.keyword.toLowerCase().includes(tableFilter.toLowerCase())
    )
  }, [analysisResults.keywordStats, tableFilter])

  // Load Sample Data
  const handleLoadSample = () => {
    setContent(
      `Plasma donation at KEDPLASMA is a straight-forward process designed to help patients in need while compensating donors for their valuable time.

Before your first appointment, ensure you review the eligibility requirements, bring proper identification, stay hydrated by drinking plenty of water, and eat a protein-rich meal.

During your visit, medical staff will check your iron levels, blood pressure, and pulse. Understanding donor compensation rates and center operating hours makes your visit smooth and efficient.`
    )
    setSemanticKeywordsRaw(
      `plasma donation
KEDPLASMA
compensation schedule
iron levels
blood pressure
eligibility requirements
donor portal
hydration tips
operating hours
appointment scheduling`
    )
    toast.success("Sample content and semantic keywords loaded!")
  }

  // Clear workspace
  const handleClear = () => {
    setContent("")
    setSemanticKeywordsRaw("")
    toast.info("Workspace cleared.")
  }

  // Copy Missing Keywords
  const handleCopyMissing = () => {
    if (analysisResults.missingList.length === 0) {
      toast.error("No missing keywords to copy!")
      return
    }
    const text = analysisResults.missingList.join(", ")
    navigator.clipboard.writeText(text)
    setCopiedMissing(true)
    toast.success("Missing keywords copied to clipboard!")
    setTimeout(() => setCopiedMissing(false), 2000)
  }

  // Copy AI Prompt for Missing Keywords
  const handleCopyPrompt = () => {
    if (analysisResults.missingList.length === 0) {
      toast.error("No missing keywords to copy!")
      return
    }
    const missingStr = analysisResults.missingList.map((k) => `"${k}"`).join(", ")
    const promptText = `Please revise the following content to naturally incorporate these missing semantic keywords while maintaining smooth readability and proper SEO paragraph structure:

Missing Keywords to Include:
${missingStr}

Content to Update:
${content}`

    navigator.clipboard.writeText(promptText)
    setCopiedPrompt(true)
    toast.success("ChatGPT Optimization Prompt copied to clipboard!")
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  // Highlighted Content HTML Generator for Preview
  const highlightedContent = useMemo(() => {
    if (!content.trim() || analysisResults.foundList.length === 0) return content

    let result = content
    // Sort keywords by length descending so longer phrases match first
    const sortedFound = [...analysisResults.foundList].sort((a, b) => b.length - a.length)

    // Build regex to replace found keywords with highlighted span
    sortedFound.forEach((kw) => {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`\\b(${escaped})\\b`, caseSensitive ? "g" : "gi")
      result = result.replace(
        regex,
        `<mark class="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold px-1 rounded border border-emerald-500/30">$1</mark>`
      )
    })

    return result
  }, [content, analysisResults.foundList, caseSensitive])

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold mb-1"
          >
            <IconArrowLeft className="size-3.5" /> Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <IconTarget className="size-6 text-sky-500" /> Missing Keyword Analyzer
          </h2>
          <p className="text-xs text-muted-foreground">
            Analyze your article text against semantic target keywords to find missing terms, keyword counts, and density.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="px-3.5 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <IconSparkles className="size-3.5 text-amber-500" /> Load Sample
          </button>
          <button
            onClick={handleClear}
            className="px-3.5 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Clear Work
          </button>
        </div>
      </div>

      {/* DUAL CONTAINER INPUT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CONTAINER 1: CONTENT TEXT */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
              <IconFileText className="size-4 text-sky-500" /> 1. Article Content Data
            </label>
            <span className="text-[10px] font-mono text-muted-foreground">
              {totalContentWords} words | {content.length} chars
            </span>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[350px]">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your webpage or blog post article content text here..."
              className="w-full h-full border-0 bg-transparent p-4 text-xs font-sans focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* CONTAINER 2: SEMANTIC KEYWORDS */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
              <IconKey className="size-4 text-amber-500" /> 2. Target Semantic Keywords
            </label>
            <span className="text-[10px] font-mono text-muted-foreground">
              {targetKeywords.length} keywords defined
            </span>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3 h-[350px] flex flex-col justify-between">
            <textarea
              value={semanticKeywordsRaw}
              onChange={(e) => setSemanticKeywordsRaw(e.target.value)}
              placeholder="Paste target semantic keywords (separated by lines or commas)...
e.g.
plasma donation
KEDPLASMA
compensation schedule
iron levels"
              className="w-full flex-1 border border-border rounded-lg bg-background p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none leading-relaxed"
            />

            {/* Match Settings Controls */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded border-border text-sky-500 focus:ring-sky-500"
                />
                <span>Case Sensitive</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={wholeWordMatch}
                  onChange={(e) => setWholeWordMatch(e.target.checked)}
                  className="rounded border-border text-sky-500 focus:ring-sky-500"
                />
                <span>Whole Word Match</span>
              </label>
            </div>
          </div>
        </div>

      </div>

      {/* ANALYSIS DASHBOARD SECTION */}
      {targetKeywords.length > 0 && content.trim() ? (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Total Target Keywords
              </span>
              <span className="text-2xl font-extrabold block mt-1">
                {targetKeywords.length}
              </span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Found Keywords
              </span>
              <span className="text-2xl font-extrabold text-emerald-500 block mt-1">
                {analysisResults.foundCount}
              </span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Missing Keywords
              </span>
              <span className={`text-2xl font-extrabold block mt-1 ${analysisResults.missingCount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                {analysisResults.missingCount}
              </span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Semantic Coverage
              </span>
              <span className="text-2xl font-extrabold text-sky-500 block mt-1">
                {analysisResults.coveragePct.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* COVERAGE PROGRESS BAR */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-foreground">Keyword Coverage Score</span>
              <span className="text-sky-500 font-bold">{analysisResults.coveragePct.toFixed(1)}% Completed</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  analysisResults.coveragePct === 100
                    ? "bg-emerald-500"
                    : analysisResults.coveragePct >= 60
                    ? "bg-sky-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${analysisResults.coveragePct}%` }}
              />
            </div>
          </div>

          {/* MISSING KEYWORDS HIGHLIGHT BOX */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  <IconAlertTriangle className="size-4 text-amber-500" /> Missing Semantic Keywords ({analysisResults.missingCount})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  These target keywords were NOT found in your article content.
                </p>
              </div>

              {analysisResults.missingCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyMissing}
                    className="px-3 py-1.5 text-xs font-bold border border-border bg-muted/60 hover:bg-muted text-foreground rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {copiedMissing ? <IconCheck className="size-3.5 text-emerald-500" /> : <IconCopy className="size-3.5" />}
                    Copy List
                  </button>
                  <button
                    onClick={handleCopyPrompt}
                    className="px-3.5 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-sky-500/10"
                  >
                    {copiedPrompt ? <IconCheck className="size-3.5" /> : <IconSparkles className="size-3.5" />}
                    Copy AI Prompt
                  </button>
                </div>
              )}
            </div>

            {analysisResults.missingCount > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {analysisResults.missingList.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1.5"
                  >
                    <IconCircleX className="size-3.5 shrink-0" />
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-emerald-500 font-semibold flex items-center justify-center gap-1.5 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                <IconCircleCheck className="size-4" /> Perfect! All semantic keywords are present in your article content.
              </div>
            )}
          </div>

          {/* FOUND & ALL KEYWORDS BREAKDOWN TABLE */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <IconListCheck className="size-4 text-sky-500" /> Full Keyword Density & Status Report
              </h3>

              {/* Table Search Filter */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  placeholder="Filter keywords..."
                  className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <IconSearch className="size-3.5 text-muted-foreground absolute left-2.5 top-2" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="py-2.5 pr-4">Target Keyword</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                    <th className="py-2.5 px-2 text-center">Frequency (Count)</th>
                    <th className="py-2.5 pl-4 text-right">Density (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredKeywordStats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 pr-4 font-semibold text-foreground">
                        {stat.keyword}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {stat.found ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <IconCircleCheck className="size-3" /> Found
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            <IconCircleX className="size-3" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">
                        {stat.count}x
                      </td>
                      <td className="py-2.5 pl-4 text-right font-mono font-semibold text-muted-foreground">
                        {stat.density.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* HIGHLIGHTED CONTENT PREVIEW */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5 border-b border-border pb-3">
              <IconEye className="size-4 text-sky-500" /> Highlighted Article Preview
            </h3>
            <div
              className="p-4 rounded-lg bg-muted/30 border border-border text-xs leading-relaxed font-sans whitespace-pre-wrap select-text max-h-[350px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />
          </div>

        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground space-y-3 shadow-sm">
          <IconTarget className="size-8 text-muted-foreground/60 mx-auto" />
          <h4 className="text-sm font-bold text-foreground">Waiting for Content & Keywords...</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Paste your article text in Container 1 and target keywords in Container 2 (or click "Load Sample") to view missing keywords analysis.
          </p>
        </div>
      )}

    </div>
  )
}
