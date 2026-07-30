"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import {
  IconArrowLeft,
  IconCopy,
  IconCheck,
  IconTemplate,
  IconWorld,
  IconUser,
  IconSparkles,
  IconFileText,
  IconArrowsShuffle,
  IconLoader2,
  IconRobot,
  IconWand,
  IconRefresh,
  IconAdjustmentsHorizontal,
  IconCpu
} from "@tabler/icons-react"

export type CategoryType =
  | "Author Box Title"
  | "Author Box Content"
  | "Disclaimer Title"
  | "Disclaimer Content"
  | "Footer Notice"

interface TemplateItem {
  id: string
  category: CategoryType
  variationNumber: number
  name: string
  description: string
  contentText: (targetWeb: string, targetAuth: string) => string
}

export default function TemplateSwitcherPage() {
  // Target Inputs
  const [targetWebsite, setTargetWebsite] = useState<string>("NMLS")
  const [targetAuthor, setTargetAuthor] = useState<string>("Daniel Rodriguez")

  // Generation Engine Mode: 'ai' or 'preset'
  const [engineMode, setEngineMode] = useState<"ai" | "preset">("ai")

  // AI Prompt & Tone Options
  const [aiTone, setAiTone] = useState<string>("Professional & Clear")
  const [customAiPrompt, setCustomAiPrompt] = useState<string>("")

  // AI Package Data State
  const [aiPackage, setAiPackage] = useState<Record<CategoryType, string>>({
    "Author Box Title": "",
    "Author Box Content": "",
    "Disclaimer Title": "",
    "Disclaimer Content": "",
    "Footer Notice": ""
  })

  // Loading States
  const [isAiPackageLoading, setIsAiPackageLoading] = useState<boolean>(false)
  const [loadingCategories, setLoadingCategories] = useState<Record<string, boolean>>({})
  const [isPackageCopied, setIsPackageCopied] = useState<boolean>(false)

  // Preset Variation Index Map (0-4 for each category)
  const [variationMap, setVariationMap] = useState<Record<CategoryType, number>>({
    "Author Box Title": 0,
    "Author Box Content": 0,
    "Disclaimer Title": 0,
    "Disclaimer Content": 0,
    "Footer Notice": 0
  })

  // 25 Clean Preset Templates (5 per category)
  const allTemplates: TemplateItem[] = useMemo(
    () => [
      // CATEGORY 1: AUTHOR BOX CONTENT
      {
        id: "author-box-1",
        category: "Author Box Content",
        variationNumber: 1,
        name: "Author Box - Variation 1 (Comprehensive Portal & Service Guide)",
        description: "Introductory guide tone for official systems, portals, and service guides.",
        contentText: (targetWeb, targetAuth) =>
          `Hi, I'm ${targetAuth}, and I put together this guide to help you navigate ${targetWeb}, whether it's your very first visit or you're already a regular user.

Navigating online portals, requirements, and policies can feel overwhelming. My aim with this guide is to take the guesswork out of it, so you know exactly what to expect and can find reliable answers quickly.

Thanks for stopping by. I hope this resource helps you make informed decisions with confidence.

${targetAuth}`
      },
      {
        id: "author-box-2",
        category: "Author Box Content",
        variationNumber: 2,
        name: "Author Box - Variation 2 (Passionate Guide & Troubleshooting)",
        description: "Focuses on providing step-by-step guides and stress-free advice.",
        contentText: (targetWeb, targetAuth) =>
          `Hello! I'm ${targetAuth}, and I'm passionate about helping users understand everything about ${targetWeb}. Whether you're looking to understand features, check requirements, or troubleshoot common issues, I'm here to make the process simple and stress-free.

This website is dedicated to providing accurate, easy-to-follow, and up-to-date information about ${targetWeb}. From step-by-step navigation guides to policy breakdowns, you'll find practical resources designed to answer your questions with clarity.

My goal is to break down complex procedures into straightforward advice that anyone can follow.

${targetAuth}`
      },
      {
        id: "author-box-3",
        category: "Author Box Content",
        variationNumber: 3,
        name: "Author Box - Variation 3 (Research & Unbiased Information)",
        description: "Emphasizes research, clarity, and saving readers time.",
        contentText: (targetWeb, targetAuth) =>
          `I'm ${targetAuth}, the writer behind this website. My focus is on researching and explaining everything related to ${targetWeb} so you can find accurate answers without spending hours searching through multiple sources.

On this website, you'll discover practical guides covering how to navigate ${targetWeb}, understand key requirements, avoid common mistakes, and stay informed on recent updates.

I believe reliable information should be clear, unbiased, and easy to follow. Thank you for stopping by!

Best wishes,

${targetAuth}`
      },
      {
        id: "author-box-4",
        category: "Author Box Content",
        variationNumber: 4,
        name: "Author Box - Variation 4 (Welcome & Trusted Resource)",
        description: "Welcome introduction framing the site as a trusted, updated resource.",
        contentText: (targetWeb, targetAuth) =>
          `Welcome! I'm ${targetAuth}, the writer and researcher behind this website dedicated to ${targetWeb}.

My mission is to provide clear, reliable, and easy-to-understand information for anyone looking to learn more about ${targetWeb}. Whether you're exploring services, checking guidelines, or seeking official resources, this guide is designed to help you every step of the way.

As programs and policies change over time, I strive to keep the content updated so you can move forward with confidence.

Thank you for visiting!

Best wishes,

${targetAuth}`
      },
      {
        id: "author-box-5",
        category: "Author Box Content",
        variationNumber: 5,
        name: "Author Box - Variation 5 (Friendly Greeting & Plain Language)",
        description: "Warm, friendly greeting emphasizing plain language explanations.",
        contentText: (targetWeb, targetAuth) =>
          `Hi, I'm ${targetAuth}, and I'm glad you're here!

I created this website to help people find trustworthy, easy-to-read information about ${targetWeb} without having to search through confusing documentation.

My approach is simple: explain everything in plain language, keep the information organized, and focus on what matters most to readers.

Thank you for visiting! I hope this website helps you save time and enjoy a smoother experience.

Best Wishes,

${targetAuth}`
      },

      // CATEGORY 2: DISCLAIMER CONTENT
      {
        id: "disclaimer-1",
        category: "Disclaimer Content",
        variationNumber: 1,
        name: "Disclaimer - Variation 1 (Standard Independent Publisher Notice)",
        description: "Covers independent operation, non-affiliation, and trademark owners.",
        contentText: (targetWeb) =>
          `This website operates independently and has no affiliation, endorsement, or official association with ${targetWeb} or any of its parent organizations or affiliates.

All trademarks, service marks, trade names, product names, and logos referenced here belong to their respective owners. Content is provided strictly for educational and informational purposes.

The publisher assumes no responsibility for outcomes resulting from the use of information found on this website.`
      },
      {
        id: "disclaimer-2",
        category: "Disclaimer Content",
        variationNumber: 2,
        name: "Disclaimer - Variation 2 (Educational Resource & No Liability)",
        description: "States educational intent and disclaims owner liability.",
        contentText: (targetWeb) =>
          `This website is an independent informational resource and is not connected with, authorized by, or officially supported by ${targetWeb}.

Trademarks, brand names, and service marks mentioned throughout this website are the property of their respective owners. For official services, accounts, and binding guidelines, please consult the official portal directly.

The website owner is not liable for decisions, losses, or consequences arising from reliance on the information provided here.`
      },
      {
        id: "disclaimer-3",
        category: "Disclaimer Content",
        variationNumber: 3,
        name: "Disclaimer - Variation 3 (No Partnership & General Reference)",
        description: "Emphasizes use of names for identification only.",
        contentText: (targetWeb) =>
          `This website has been created solely for informational and reference purposes. It is an independent resource and is not sponsored by, affiliated with, or endorsed by ${targetWeb}.

All brand names and trademarks mentioned are used solely for identification purposes. Their use does not imply any partnership or endorsement.

For official assistance or account access, please visit the official ${targetWeb} portal.`
      },
      {
        id: "disclaimer-4",
        category: "Disclaimer Content",
        variationNumber: 4,
        name: "Disclaimer - Variation 4 (Independent Platform)",
        description: "Reminds users to independently verify critical information.",
        contentText: (targetWeb) =>
          `This site is an independent informational platform and is not operated by, connected to, or representative of ${targetWeb}.

All logos and product names remain the property of their respective owners. We do not guarantee the completeness or accuracy of third-party policy details, as official rules change frequently.

Users are advised to independently verify all critical data directly with official providers.`
      },
      {
        id: "disclaimer-5",
        category: "Disclaimer Content",
        variationNumber: 5,
        name: "Disclaimer - Variation 5 (Privately Operated Portal Notice)",
        description: "Clarifies inability to process official transactions or claims.",
        contentText: (targetWeb) =>
          `This website is a privately operated informational resource and is not owned by or affiliated with ${targetWeb}.

This site does not provide access to official account portals and cannot process claims, filings, registrations, or official transactions. Content is compiled from publicly available reference materials.

Please navigate to official channels for account logins and official submissions.`
      },

      // CATEGORY 3: AUTHOR BOX TITLE
      {
        id: "author-title-1",
        category: "Author Box Title",
        variationNumber: 1,
        name: "Author Title 1 (A Note from [Author])",
        description: "A Note from [Author Name]",
        contentText: (_, targetAuth) => `A Note from ${targetAuth}`
      },
      {
        id: "author-title-2",
        category: "Author Box Title",
        variationNumber: 2,
        name: "Author Title 2 (A Message from [Author])",
        description: "A Message from [Author Name]",
        contentText: (_, targetAuth) => `A Message from ${targetAuth}`
      },
      {
        id: "author-title-3",
        category: "Author Box Title",
        variationNumber: 3,
        name: "Author Title 3 (Author's Message)",
        description: "Author's Message",
        contentText: () => `Author's Message`
      },
      {
        id: "author-title-4",
        category: "Author Box Title",
        variationNumber: 4,
        name: "Author Title 4 (Meet the Author, [Author])",
        description: "Meet the Author, [Author Name]",
        contentText: (_, targetAuth) => `Meet the Author, ${targetAuth}`
      },
      {
        id: "author-title-5",
        category: "Author Box Title",
        variationNumber: 5,
        name: "Author Title 5 (A Letter from [Author])",
        description: "A Letter from [Author Name]",
        contentText: (_, targetAuth) => `A Letter from ${targetAuth}`
      },

      // CATEGORY 4: DISCLAIMER TITLE
      {
        id: "disclaimer-title-1",
        category: "Disclaimer Title",
        variationNumber: 1,
        name: "Disclaimer Title 1 (Important Notice)",
        description: "Important Notice",
        contentText: () => `Important Notice`
      },
      {
        id: "disclaimer-title-2",
        category: "Disclaimer Title",
        variationNumber: 2,
        name: "Disclaimer Title 2 (Disclaimer)",
        description: "Disclaimer",
        contentText: () => `Disclaimer`
      },
      {
        id: "disclaimer-title-3",
        category: "Disclaimer Title",
        variationNumber: 3,
        name: "Disclaimer Title 3 (Legal Notice)",
        description: "Legal Notice",
        contentText: () => `Legal Notice`
      },
      {
        id: "disclaimer-title-4",
        category: "Disclaimer Title",
        variationNumber: 4,
        name: "Disclaimer Title 4 (Affiliation Notice)",
        description: "Affiliation Notice",
        contentText: () => `Affiliation Notice`
      },
      {
        id: "disclaimer-title-5",
        category: "Disclaimer Title",
        variationNumber: 5,
        name: "Disclaimer Title 5 (Important Information)",
        description: "Important Information",
        contentText: () => `Important Information`
      },

      // CATEGORY 5: FOOTER NOTICE
      {
        id: "footer-1",
        category: "Footer Notice",
        variationNumber: 1,
        name: "Footer Notice 1 (Rights Reserved & Independent)",
        description: "Standard copyright notice with independent resource disclosure.",
        contentText: (targetWeb, targetAuth) =>
          `© ${new Date().getFullYear()} ${targetWeb}. All rights reserved. This site is an independent informational resource compiled by ${targetAuth} and is not affiliated with or endorsed by any referenced brand.`
      },
      {
        id: "footer-2",
        category: "Footer Notice",
        variationNumber: 2,
        name: "Footer Notice 2 (Informational Guide & Curated Content)",
        description: "Highlights curated content and trademark ownership.",
        contentText: (targetWeb, targetAuth) =>
          `Independent Informational Guide for ${targetWeb}. Content curated by ${targetAuth}. All trademarks, brand names, and logos belong to their respective owners.`
      },
      {
        id: "footer-3",
        category: "Footer Notice",
        variationNumber: 3,
        name: "Footer Notice 3 (Educational Resource Notice)",
        description: "States educational resource purpose and author management.",
        contentText: (targetWeb, targetAuth) =>
          `Disclaimer: ${targetWeb} operates independently as an educational resource. Content managed by ${targetAuth}. Not an official representative website.`
      },
      {
        id: "footer-4",
        category: "Footer Notice",
        variationNumber: 4,
        name: "Footer Notice 4 (Copyright & Written/Edited By)",
        description: "Includes copyright year, website name, and author credit.",
        contentText: (targetWeb, targetAuth) =>
          `Copyright © ${new Date().getFullYear()} ${targetWeb} | Independent Directory. Written & edited by ${targetAuth}. Product names and trademarks are property of their original copyright holders.`
      },
      {
        id: "footer-5",
        category: "Footer Notice",
        variationNumber: 5,
        name: "Footer Notice 5 (Standalone Website Notice)",
        description: "Simple standalone notice for footers.",
        contentText: (targetWeb, targetAuth) =>
          `Notice: ${targetWeb} is a standalone informational website created by ${targetAuth}. All content is provided for reference only without official brand endorsement.`
      }
    ],
    []
  )

  // Get current text for a category depending on engineMode
  const getCategoryDisplay = (cat: CategoryType) => {
    const web = targetWebsite.trim() || "TARGET_WEBSITE"
    const auth = targetAuthor.trim() || "TARGET_AUTHOR"

    if (engineMode === "ai" && aiPackage[cat]?.trim()) {
      return {
        isAi: true,
        variationLabel: "Azure OpenAI (gpt-5.4-nano)",
        text: aiPackage[cat]
      }
    }

    // Fallback or preset mode
    const templates = allTemplates.filter((t) => t.category === cat)
    const varIdx = variationMap[cat] || 0
    const template = templates[varIdx] || templates[0]

    return {
      isAi: false,
      variationLabel: `Preset Variation #${template.variationNumber}`,
      text: template.contentText(web, auth)
    }
  }

  // Safe Clipboard Copy Helper (Handles async permissions & fallback execCommand)
  const safeCopyToClipboard = async (text: string): Promise<boolean> => {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (err) {
        console.warn("Direct navigator.clipboard.writeText failed, using fallback:", err)
      }
    }

    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)
      return successful
    } catch (err) {
      console.error("Fallback clipboard copy failed:", err)
      return false
    }
  }

  // Action 1: Generate Complete AI Package via Azure OpenAI
  const handleGenerateAiPackage = async () => {
    const web = targetWebsite.trim() || "TARGET_WEBSITE"
    const auth = targetAuthor.trim() || "TARGET_AUTHOR"

    setIsAiPackageLoading(true)
    toast.loading(`Azure OpenAI (gpt-5.4-nano) generating complete package for ${web}...`, { id: "ai-pkg" })

    try {
      const res = await fetch("/api/generate-ai-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "package",
          website: web,
          author: auth,
          tone: aiTone,
          customInstruction: customAiPrompt.trim()
        })
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate AI package")
      }

      if (data.package) {
        const newPkg: Record<CategoryType, string> = {
          "Author Box Title": data.package.authorBoxTitle || `Meet the Author, ${auth}`,
          "Author Box Content": data.package.authorBoxContent || "",
          "Disclaimer Title": data.package.disclaimerTitle || "Important Disclaimer",
          "Disclaimer Content": data.package.disclaimerContent || "",
          "Footer Notice": data.package.footerNotice || ""
        }

        setAiPackage(newPkg)
        setEngineMode("ai")

        const fullText = [
          `=== AUTHOR BOX TITLE ===\n${newPkg["Author Box Title"]}`,
          `=== AUTHOR BOX CONTENT ===\n${newPkg["Author Box Content"]}`,
          `=== DISCLAIMER TITLE ===\n${newPkg["Disclaimer Title"]}`,
          `=== DISCLAIMER CONTENT ===\n${newPkg["Disclaimer Content"]}`,
          `=== FOOTER NOTICE ===\n${newPkg["Footer Notice"]}`
        ].join("\n\n--------------------------------------------------\n\n")

        const copied = await safeCopyToClipboard(fullText)
        if (copied) {
          setIsPackageCopied(true)
          toast.success("✨ Azure OpenAI generated & copied complete package to clipboard!", { id: "ai-pkg" })
          setTimeout(() => setIsPackageCopied(false), 3000)
        } else {
          toast.success("✨ Generated complete package! Click 'Copy Complete Package' to copy.", { id: "ai-pkg" })
        }
      }
    } catch (err: any) {
      console.error("AI Package Error:", err)
      toast.error(err.message || "Failed to generate package via Azure OpenAI", { id: "ai-pkg" })
    } finally {
      setIsAiPackageLoading(false)
    }
  }

  // Action 2: Regenerate Single Category via Azure OpenAI
  const handleRegenerateSingleAi = async (cat: CategoryType) => {
    const web = targetWebsite.trim() || "TARGET_WEBSITE"
    const auth = targetAuthor.trim() || "TARGET_AUTHOR"

    setLoadingCategories((prev) => ({ ...prev, [cat]: true }))
    toast.loading(`Azure OpenAI regenerating ${cat}...`, { id: `ai-${cat}` })

    try {
      const res = await fetch("/api/generate-ai-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: cat,
          website: web,
          author: auth,
          tone: aiTone,
          customInstruction: customAiPrompt.trim(),
          baseText: aiPackage[cat] || undefined
        })
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "AI generation failed")
      }

      if (data.resultText) {
        setAiPackage((prev) => ({ ...prev, [cat]: data.resultText }))
        setEngineMode("ai")
        toast.success(`✨ Regenerated ${cat} with Azure OpenAI!`, { id: `ai-${cat}` })
      }
    } catch (err: any) {
      console.error(`AI single category error [${cat}]:`, err)
      toast.error(err.message || "Failed to generate AI section", { id: `ai-${cat}` })
    } finally {
      setLoadingCategories((prev) => ({ ...prev, [cat]: false }))
    }
  }

  // Action 3: Randomize Single Preset Variation
  const handleShufflePresetCategory = (cat: CategoryType) => {
    const currentVal = variationMap[cat] || 0
    let nextVal = Math.floor(Math.random() * 5)
    if (nextVal === currentVal) nextVal = (nextVal + 1) % 5
    setVariationMap((prev) => ({ ...prev, [cat]: nextVal }))
    toast.info(`Switched ${cat} to Preset Variation #${nextVal + 1}`, { icon: "🔀" })
  }

  // Action 4: Shuffle All Presets
  const handleShuffleAllPresets = async () => {
    const newMap: Record<CategoryType, number> = {
      "Author Box Title": Math.floor(Math.random() * 5),
      "Author Box Content": Math.floor(Math.random() * 5),
      "Disclaimer Title": Math.floor(Math.random() * 5),
      "Disclaimer Content": Math.floor(Math.random() * 5),
      "Footer Notice": Math.floor(Math.random() * 5)
    }
    setVariationMap(newMap)
    setEngineMode("preset")

    const categories: CategoryType[] = [
      "Author Box Title",
      "Author Box Content",
      "Disclaimer Title",
      "Disclaimer Content",
      "Footer Notice"
    ]

    const fullSuiteText = categories
      .map((cat) => {
        const templates = allTemplates.filter((t) => t.category === cat)
        const template = templates[newMap[cat]] || templates[0]
        const text = template.contentText(targetWebsite || "Website", targetAuthor || "Author")
        return `=== ${cat.toUpperCase()} (Variation #${template.variationNumber}) ===\n${text}`
      })
      .join("\n\n--------------------------------------------------\n\n")

    const copied = await safeCopyToClipboard(fullSuiteText)
    if (copied) {
      setIsPackageCopied(true)
      toast.success("Loaded & Copied Preset Templates Package!", { icon: "📋" })
      setTimeout(() => setIsPackageCopied(false), 2500)
    } else {
      toast.info("Loaded Preset Templates Package!")
    }
  }

  // Action 5: Copy Full Package
  const handleCopyFullPackage = async () => {
    const categories: CategoryType[] = [
      "Author Box Title",
      "Author Box Content",
      "Disclaimer Title",
      "Disclaimer Content",
      "Footer Notice"
    ]

    const fullText = categories
      .map((cat) => {
        const display = getCategoryDisplay(cat)
        return `=== ${cat.toUpperCase()} (${display.variationLabel}) ===\n${display.text}`
      })
      .join("\n\n--------------------------------------------------\n\n")

    const copied = await safeCopyToClipboard(fullText)
    if (copied) {
      toast.success("Copied complete 5-section content package to clipboard!")
    } else {
      toast.error("Clipboard copy failed. Please select text manually.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in-50 duration-300 pb-12">
      <Toaster position="top-right" />

      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold mb-1"
          >
            <IconArrowLeft className="size-3.5" /> Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <IconTemplate className="size-6 text-sky-500" /> Website Content Template Switcher
          </h2>
          <p className="text-xs text-muted-foreground">
            Generate context-aware, high-converting website content using Azure OpenAI (<span className="font-semibold text-sky-400">gpt-5.4-nano</span>) or fast preset variations.
          </p>
        </div>

        {/* AI Engine Status Badge & Mode Selector */}
        <div className="flex items-center gap-2 bg-muted/60 border border-border p-1.5 rounded-xl shrink-0">
          <button
            onClick={() => setEngineMode("ai")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              engineMode === "ai"
                ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconRobot className="size-4" />
            <span>🤖 AI Mode (Azure OpenAI)</span>
          </button>

          <button
            onClick={() => setEngineMode("preset")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              engineMode === "preset"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconFileText className="size-4" />
            <span>📋 Preset Templates</span>
          </button>
        </div>
      </div>

      {/* INPUT VARIABLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Website Name */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-1.5 shadow-sm">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <IconWorld className="size-4 text-sky-500" /> Target Website Name
          </label>
          <input
            type="text"
            value={targetWebsite}
            onChange={(e) => setTargetWebsite(e.target.value)}
            placeholder="e.g. NMLS, FMC4ME, etc."
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <span className="text-[10px] text-muted-foreground block">
            AI will analyze this website name to generate topic-relevant copy.
          </span>
        </div>

        {/* Target Author Name */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-1.5 shadow-sm">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <IconUser className="size-4 text-sky-500" /> Target Author Name
          </label>
          <input
            type="text"
            value={targetAuthor}
            onChange={(e) => setTargetAuthor(e.target.value)}
            placeholder="e.g. Daniel Rodriguez"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <span className="text-[10px] text-muted-foreground block">
            Author name to feature in Author Box and Footer credits.
          </span>
        </div>
      </div>

      {/* AI TONE & CUSTOM INSTRUCTIONS BAR */}
      <div className="bg-card border border-border/80 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <IconAdjustmentsHorizontal className="size-4 text-sky-500" /> AI Generation Settings
          </label>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
            <IconCpu className="size-3.5 text-emerald-500" />
            <span>Connected: Azure OpenAI (gpt-5.4-nano)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Tone Dropdown */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground block">Desired Content Tone</span>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="Professional & Clear">Professional & Clear</option>
              <option value="Friendly & Approachable">Friendly & Approachable</option>
              <option value="Authoritative & Informative">Authoritative & Informative</option>
              <option value="Concise & Direct">Concise & Direct</option>
            </select>
          </div>

          {/* Custom Instruction Input */}
          <div className="md:col-span-2 space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground block">Optional Custom AI Instructions</span>
            <input
              type="text"
              value={customAiPrompt}
              onChange={(e) => setCustomAiPrompt(e.target.value)}
              placeholder="e.g. Focus on licensing guidelines, keep disclaimer strictly legal..."
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* PRIMARY ACTION BAR */}
      <div className="bg-card border border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-sky-500/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center justify-center sm:justify-start gap-2">
            <IconSparkles className="size-5 text-sky-500 animate-pulse" />
            Generate Complete Website Package
          </h3>
          <p className="text-xs text-muted-foreground">
            Instantly generates ready-to-paste text for all 5 content categories tailored specifically for{" "}
            <span className="font-semibold text-foreground">{targetWebsite.trim() || "Website"}</span> and{" "}
            <span className="font-semibold text-foreground">{targetAuthor.trim() || "Author"}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleGenerateAiPackage}
            disabled={isAiPackageLoading}
            className={`w-full sm:w-auto px-5 py-3 text-xs font-extrabold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
              isPackageCopied
                ? "bg-emerald-600 text-white shadow-emerald-500/25"
                : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-sky-500/25"
            } ${isAiPackageLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isAiPackageLoading ? (
              <>
                <IconLoader2 className="size-4 animate-spin" />
                <span>Generating with Azure OpenAI...</span>
              </>
            ) : isPackageCopied ? (
              <>
                <IconCheck className="size-4 stroke-[3]" />
                <span>Copied AI Package! Ready to Paste 📋</span>
              </>
            ) : (
              <>
                <IconWand className="size-4 stroke-[2.5]" />
                <span>✨ Generate Package via Azure OpenAI</span>
              </>
            )}
          </button>

          <button
            onClick={handleShuffleAllPresets}
            className="px-3.5 py-3 text-xs font-bold bg-muted hover:bg-accent text-foreground rounded-xl border border-border transition-colors flex items-center gap-1.5"
            title="Load Offline Preset Variation"
          >
            <IconArrowsShuffle className="size-4 text-indigo-500" />
            <span className="hidden md:inline">Preset Shuffle</span>
          </button>
        </div>
      </div>

      {/* GENERATED ALL-IN-ONE PACKAGE DISPLAY */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <IconFileText className="size-4 text-emerald-500" />
              Generated Website Package (All 5 Categories)
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Mode:{" "}
              <span className="font-semibold text-foreground">
                {engineMode === "ai" ? "🤖 Azure OpenAI (gpt-5.4-nano)" : "📋 Preset Variations"}
              </span>{" "}
              for <span className="font-semibold text-foreground">{targetWebsite || "Website"}</span> &{" "}
              <span className="font-semibold text-foreground">{targetAuthor || "Author"}</span>
            </p>
          </div>

          <button
            onClick={handleCopyFullPackage}
            className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <IconCopy className="size-3.5" />
            <span>Copy Complete Package</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {(
            [
              "Author Box Title",
              "Author Box Content",
              "Disclaimer Title",
              "Disclaimer Content",
              "Footer Notice"
            ] as CategoryType[]
          ).map((cat) => {
            const display = getCategoryDisplay(cat)
            const isLoading = loadingCategories[cat]

            return (
              <div
                key={cat}
                className="bg-muted/40 border border-border/80 rounded-xl p-4 space-y-2 hover:border-sky-500/30 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{cat}</span>
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                        display.isAi
                          ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}
                    >
                      {display.variationLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Azure OpenAI Regenerate Button */}
                    <button
                      onClick={() => handleRegenerateSingleAi(cat)}
                      disabled={isLoading}
                      className="px-2.5 py-1 text-[11px] font-bold bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white rounded border border-sky-500/20 transition-all flex items-center gap-1 disabled:opacity-50"
                      title="Regenerate this specific category using Azure OpenAI"
                    >
                      {isLoading ? (
                        <IconLoader2 className="size-3 animate-spin" />
                      ) : (
                        <IconSparkles className="size-3 text-sky-400" />
                      )}
                      <span>AI Re-roll</span>
                    </button>

                    {/* Shuffle Preset Button */}
                    <button
                      onClick={() => handleShufflePresetCategory(cat)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-muted hover:bg-accent text-muted-foreground hover:text-foreground rounded border border-border/60 transition-colors flex items-center gap-1"
                      title="Switch to next preset template variation"
                    >
                      <IconArrowsShuffle className="size-3 text-indigo-400" />
                      <span>Preset</span>
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={async () => {
                        const success = await safeCopyToClipboard(display.text)
                        if (success) {
                          toast.success(`Copied ${cat}!`)
                        } else {
                          toast.error(`Failed to copy ${cat}.`)
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded border border-emerald-500/20 transition-all flex items-center gap-1"
                    >
                      <IconCopy className="size-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xs text-foreground bg-background/80 border border-border/50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-sky-400">
                      <IconLoader2 className="size-4 animate-spin" />
                      Generating with Azure OpenAI...
                    </div>
                  )}
                  {display.text}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
