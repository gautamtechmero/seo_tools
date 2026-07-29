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
  IconDice
} from "@tabler/icons-react"

export type CategoryType = "Author Box Content" | "Disclaimer Content" | "Author Box Title" | "Disclaimer Title" | "Footer Notice"

interface TemplateItem {
  id: string
  category: CategoryType
  variationNumber: number
  name: string
  description: string
  contentText: (targetWeb: string, targetAuth: string) => string
}

export default function TemplateSwitcherPage() {
  // Input fields (User inputs Target Website & Target Author)
  const [targetWebsite, setTargetWebsite] = useState<string>("FMC4ME")
  const [targetAuthor, setTargetAuthor] = useState<string>("Daniel Rodriguez")

  // Selected Category
  const [activeCategory, setActiveCategory] = useState<CategoryType>("Author Box Content")

  // Selected Variation Index (0 to 4)
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0)
  
  // Copy indicator state
  const [copiedText, setCopiedText] = useState<boolean>(false)

  // 25 Total Direct-Text Templates across 5 Categories (5 templates each)
  const allTemplates: TemplateItem[] = useMemo(
    () => [
      // -------------------------------------------------------------
      // CATEGORY 1: 5 AUTHOR BOX CONTENT TEMPLATES (Direct Text)
      // -------------------------------------------------------------
      {
        id: "author-box-1",
        category: "Author Box Content",
        variationNumber: 1,
        name: "Author Box - Variation 1 (Plasma / General Guide Style)",
        description: "Introductory guide tone for plasma centers and service portals.",
        contentText: (targetWeb, targetAuth) =>
          `Hi, I'm ${targetAuth}, and I put together this guide to help you navigate plasma donation at ${targetWeb}, whether it's your very first visit or you're already a regular.

Walking into a donation center for the first time can feel like a lot: eligibility questions, what to eat beforehand, how long it'll take, what the compensation schedule actually looks like. And even for frequent donors, it helps to have a clear resource on hand for things like scheduling, iron level requirements, or what changes if you switch centers.

My aim with this guide is to take the guesswork out of it, so you know exactly what to expect before you sit down in the chair, and you can focus on what matters: staying comfortable, staying informed, and knowing your donation is making a real difference.

Thanks for taking the time to donate. It genuinely matters.

${targetAuth}`
      },
      {
        id: "author-box-2",
        category: "Author Box Content",
        variationNumber: 2,
        name: "Author Box - Variation 2 (Passionate Guide & Troubleshooting)",
        description: "Focuses on providing step-by-step guides and stress-free advice.",
        contentText: (targetWeb, targetAuth) =>
          `Hello! I'm ${targetAuth}, and I'm passionate about helping travelers and shoppers understand everything about ${targetWeb}. Whether you're looking to purchase a gift card, redeem it for flights, understand the terms and conditions, or maximize its value, I'm here to make the process simple and stress-free.

This website is dedicated to providing accurate, easy-to-follow, and up-to-date information about ${targetWeb}. From step-by-step redemption guides and eligibility requirements to money-saving tips and common troubleshooting solutions, you'll find practical resources designed to answer your questions with clarity.

My goal is to break down complex information into straightforward advice that anyone can follow. I believe that finding reliable information shouldn't be complicated, and every guide on this site is created to help you make informed decisions with confidence.

${targetAuth}`
      },
      {
        id: "author-box-3",
        category: "Author Box Content",
        variationNumber: 3,
        name: "Author Box - Variation 3 (Research & Unbiased Information)",
        description: "Emphasizes research, clarity, and saving readers time.",
        contentText: (targetWeb, targetAuth) =>
          `I'm ${targetAuth}, the writer behind this website and someone who enjoys making information easier to understand. My focus is on researching and explaining everything related to ${targetWeb} so you can find accurate answers without spending hours searching through multiple sources.

On this website, you'll discover practical guides covering how to navigate ${targetWeb}, understand benefits, check important policies, and avoid common mistakes. I also share helpful tips to help you maximize your value and make the most of every visit.

I believe reliable information should be clear, unbiased, and easy to follow. That's why every article is written in simple language with step-by-step explanations, whether you're using ${targetWeb} for the first time or you're already familiar with the process.

Thank you for stopping by. I hope this website becomes your go-to resource whenever you need trustworthy information about ${targetWeb}.

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

My mission is to provide clear, reliable, and easy-to-understand information for anyone looking to learn more about ${targetWeb}. Whether you're exploring current offers, purchasing products, or understanding terms and restrictions, this resource is designed to help you every step of the way.

I focus on creating practical guides that simplify complex policies and answer the questions real users ask. Every article is written with the goal of saving you time by presenting accurate information in a straightforward, reader-friendly format.

As programs and promotional offers can change over time, I strive to keep the content updated so you can make informed decisions with confidence. Whether you're a first-time visitor or a frequent user, you'll find helpful insights, step-by-step tutorials, and useful tips throughout this website.

Thank you for stopping by. I hope this guide becomes your trusted resource for everything related to ${targetWeb}.

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

I created this website to help people find trustworthy, easy-to-read information about ${targetWeb} without having to search through multiple sources. Whether you're wondering how these services work, where to find details, or how to get the best value, you'll find practical answers here.

My approach is simple: explain everything in plain language, keep the information organized, and focus on what matters most to readers. Every guide is designed to answer common questions, clear up confusion, and provide step-by-step instructions that are easy to follow.

I'm committed to keeping this resource informative and up to date, so you can confidently navigate ${targetWeb} options and related policies as they evolve.

Thank you for visiting! I hope this website helps you save time, make smarter decisions, and enjoy a smoother experience.

Best Wishes,

${targetAuth}`
      },

      // -------------------------------------------------------------
      // CATEGORY 2: 5 DISCLAIMER CONTENT TEMPLATES (Direct Text)
      // -------------------------------------------------------------
      {
        id: "disclaimer-1",
        category: "Disclaimer Content",
        variationNumber: 1,
        name: "Disclaimer - Variation 1 (Standard Independent Publisher Notice)",
        description: "Covers independent operation, non-affiliation, trademarks, and content advice.",
        contentText: (targetWeb) =>
          `This website operates independently and has no affiliation, endorsement, or association with ${targetWeb} or any of its products or services.

All trademarks, service marks, trade names, product names, and logos referenced here belong to their respective owners. Similarly, all visual content including images, illustrations, and photographs remains the copyrighted property of its original owner.

Nothing on this site constitutes a recommendation or endorsement of any particular service provider, plan, or course of action. Content is provided for informational purposes only and should not replace professional advice. This site is not endorsed by, or affiliated with, ${targetWeb.toLowerCase()}.com or its providers.

The publisher assumes no responsibility for outcomes resulting from the use of information found on this website.`
      },
      {
        id: "disclaimer-2",
        category: "Disclaimer Content",
        variationNumber: 2,
        name: "Disclaimer - Variation 2 (Educational Resource & No Liability)",
        description: "States educational intent and disclaims owner liability for decisions.",
        contentText: (targetWeb) =>
          `This website is an independent informational resource and is not connected with, authorized by, or officially supported by ${targetWeb} or any of its affiliates.

Any trademarks, brand names, logos, product names, and service marks mentioned throughout this website are the property of their respective owners. All images, illustrations, and other visual materials remain the intellectual property of their original copyright holders.

The information published here is intended solely to educate and inform readers. It should not be interpreted as official guidance, professional advice, or an endorsement of any company, product, or service. For the most accurate and up-to-date information, please refer to official websites.

The website owner is not liable for any decisions, losses, or consequences arising from the use of the information provided on this site.`
      },
      {
        id: "disclaimer-3",
        category: "Disclaimer Content",
        variationNumber: 3,
        name: "Disclaimer - Variation 3 (No Partnership & General Reference)",
        description: "Emphasizes use of trademarks for identification only without partnership.",
        contentText: (targetWeb) =>
          `This website has been created solely for informational and educational purposes. It is an independent resource and is not sponsored by, affiliated with, authorized by, or endorsed by ${targetWeb} or any of its affiliated companies.

All trademarks, logos, brand names, product names, and service marks mentioned on this website are the property of their respective owners and are used solely for identification purposes. Their use does not imply any partnership or endorsement.

The content published here is intended for general informational and educational purposes only. While we strive to keep the information accurate and up to date, we cannot guarantee its completeness or accuracy. For official details, please refer to the primary official website.

The website owner is not responsible for any losses, damages, or decisions resulting from the use of the information provided on this site.`
      },
      {
        id: "disclaimer-4",
        category: "Disclaimer Content",
        variationNumber: 4,
        name: "Disclaimer - Variation 4 (Independent Platform & Independent Verification)",
        description: "Reminds users to independently verify critical information.",
        contentText: (targetWeb) =>
          `This site is an independent informational platform and is not operated by, connected to, or representative of ${targetWeb} or any of its related entities. No affiliation, sponsorship, or endorsement by ${targetWeb} or its partners should be inferred.

All product names, logos, and service marks appearing here remain the property of their respective owners and are used solely for identification.

The content is for general reference and educational use only. We do not guarantee its accuracy, currency, or completeness, as program details and policies may change. For official and binding information, please consult official portals or authorized representatives.

The website owner accepts no liability for any losses, claims, or decisions arising from reliance on the information provided. Users are responsible for independently verifying all critical data.`
      },
      {
        id: "disclaimer-5",
        category: "Disclaimer Content",
        variationNumber: 5,
        name: "Disclaimer - Variation 5 (Privately Operated & Account Portal Notice)",
        description: "Clarifies that the site cannot process claims or account transactions.",
        contentText: (targetWeb) =>
          `This website is an independent, privately operated informational resource and is not owned, operated by, affiliated with, or endorsed by ${targetWeb} or its affiliates. All brand names, logos, and marks referenced here belong to their respective owners and are used solely for identification.

This site does not provide access to official account services and cannot process claims, enrollments, payments, or account activity. Content is for general informational purposes only, compiled from publicly available sources, and may be outdated or inaccurate. For current, official information, please visit official portals directly.

This site does not offer professional, legal, tax, or financial advice. Users must independently verify all information before relying on it. The site owner accepts no liability for losses or decisions arising from use of this content.`
      },

      // -------------------------------------------------------------
      // CATEGORY 3: 5 AUTHOR BOX TITLE TEMPLATES (Direct Text)
      // -------------------------------------------------------------
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

      // -------------------------------------------------------------
      // CATEGORY 4: 5 DISCLAIMER TITLE TEMPLATES (Direct Text)
      // -------------------------------------------------------------
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

      // -------------------------------------------------------------
      // CATEGORY 5: 5 FOOTER NOTICE TEMPLATES (Direct Text)
      // -------------------------------------------------------------
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
          `Disclaimer: ${targetWeb} operates independently as an educational resource. Articles managed by ${targetAuth}. Not an official representative website.`
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

  // Current category templates (5 templates)
  const categoryTemplates = useMemo(() => {
    return allTemplates.filter((t) => t.category === activeCategory)
  }, [allTemplates, activeCategory])

  // Current selected template
  const currentTemplate = categoryTemplates[selectedVariationIndex] || categoryTemplates[0]

  // Direct Content Output Text
  const generatedText = useMemo(() => {
    const web = targetWebsite.trim() || "TARGET_WEBSITE"
    const auth = targetAuthor.trim() || "TARGET_AUTHOR"
    return currentTemplate.contentText(web, auth)
  }, [currentTemplate, targetWebsite, targetAuthor])

  // Shuffle Function: Pick a random variation
  const handleShuffle = () => {
    let newIdx = Math.floor(Math.random() * categoryTemplates.length)
    if (categoryTemplates.length > 1 && newIdx === selectedVariationIndex) {
      newIdx = (newIdx + 1) % categoryTemplates.length
    }
    setSelectedVariationIndex(newIdx)
    toast.success(`🎲 Shuffled! Loaded ${activeCategory} (Variation ${newIdx + 1})`, {
      icon: "🔀"
    })
  }

  // Global Shuffle: Pick a random category AND variation
  const handleGlobalShuffle = () => {
    const categories: CategoryType[] = [
      "Author Box Content",
      "Disclaimer Content",
      "Author Box Title",
      "Disclaimer Title",
      "Footer Notice"
    ]
    const randomCat = categories[Math.floor(Math.random() * categories.length)]
    const randomVar = Math.floor(Math.random() * 5)
    setActiveCategory(randomCat)
    setSelectedVariationIndex(randomVar)
    toast.success(`🎲 Global Shuffle! Selected ${randomCat} (Var ${randomVar + 1})`, {
      icon: "🔀"
    })
  }

  // Copy Direct Text to Clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedText)
    setCopiedText(true)
    toast.success("Text copied to clipboard! Ready to paste.")
    setTimeout(() => setCopiedText(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
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
            Enter Website Name and Author to generate ready-to-paste website content. Shuffle or select variations for a different template every time.
          </p>
        </div>

        {/* Global Shuffle & Cycle Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGlobalShuffle}
            className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            title="Randomize Category and Variation"
          >
            <IconDice className="size-4" /> Global Shuffle
          </button>

          <button
            onClick={handleShuffle}
            className="px-4 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow-sm shadow-sky-500/20 transition-all flex items-center gap-2"
          >
            <IconArrowsShuffle className="size-4" /> Shuffle Template
          </button>
        </div>
      </div>

      {/* INPUT VARIABLES GRID (Target Website & Target Author) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Website Name */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-1.5 shadow-sm">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <IconWorld className="size-4 text-sky-500" /> Website Name
          </label>
          <input
            type="text"
            value={targetWebsite}
            onChange={(e) => setTargetWebsite(e.target.value)}
            placeholder="e.g. FMC4ME"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <span className="text-[10px] text-muted-foreground block">
            Target website name (e.g., FMC4ME)
          </span>
        </div>

        {/* Target Author Name */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-1.5 shadow-sm">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <IconUser className="size-4 text-sky-500" /> Author Name
          </label>
          <input
            type="text"
            value={targetAuthor}
            onChange={(e) => setTargetAuthor(e.target.value)}
            placeholder="e.g. Daniel Rodriguez"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <span className="text-[10px] text-muted-foreground block">
            Author name to insert into content (e.g., Daniel Rodriguez)
          </span>
        </div>
      </div>

      {/* CATEGORY SELECTOR TABS */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-tight uppercase text-muted-foreground flex items-center gap-1.5">
            <IconSparkles className="size-4 text-sky-500" /> Content Category
          </h3>
          <span className="text-[11px] font-semibold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            {activeCategory}
          </span>
        </div>

        {/* Category Selector Chips */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              "Author Box Content",
              "Disclaimer Content",
              "Author Box Title",
              "Disclaimer Title",
              "Footer Notice"
            ] as CategoryType[]
          ).map((cat) => {
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setSelectedVariationIndex(0)
                  toast.info(`Switched category to ${cat}`)
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{cat}</span>
                {isSelected && <IconCheck className="size-3.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* VARIATION SELECTOR & SHUFFLE ROW */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-tight uppercase text-muted-foreground flex items-center gap-1.5">
            <IconTemplate className="size-4 text-amber-500" /> Select Variation ({categoryTemplates.length} Available)
          </h3>
          
          <button
            onClick={handleShuffle}
            className="px-3 py-1 text-xs font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20 hover:bg-sky-500 hover:text-white rounded-md transition-all flex items-center gap-1.5"
          >
            <IconArrowsShuffle className="size-3.5" /> Shuffle Variation
          </button>
        </div>

        {/* Variation Buttons (1 to 5) */}
        <div className="flex flex-wrap gap-2">
          {categoryTemplates.map((tpl, index) => {
            const isSelected = selectedVariationIndex === index
            return (
              <button
                key={tpl.id}
                onClick={() => {
                  setSelectedVariationIndex(index)
                  toast.info(`Loaded Variation #${index + 1}`)
                }}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>Variation #{index + 1}</span>
                {isSelected && <IconCheck className="size-3.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* MAIN GENERATED OUTPUT BOX */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
        
        {/* Output Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                {currentTemplate.name}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 border border-sky-500/20">
                Variation #{currentTemplate.variationNumber}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {currentTemplate.description}
            </p>
          </div>

          {/* Action Buttons: Shuffle + Copy Direct Text */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShuffle}
              className="px-3.5 py-2 text-xs font-bold bg-muted hover:bg-accent border border-border rounded-lg transition-colors flex items-center gap-1.5 text-foreground"
              title="Shuffle Variation"
            >
              <IconArrowsShuffle className="size-4 text-sky-500" /> Shuffle
            </button>

            <button
              onClick={handleCopyText}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-500/10"
            >
              {copiedText ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
              {copiedText ? "Copied Text!" : "Copy Text"}
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <IconFileText className="size-4 text-emerald-500" /> Ready-to-Paste Website Content
            </span>
            <span className="font-mono text-[11px]">{generatedText.length} characters</span>
          </div>
          <div className="bg-muted/50 border border-border rounded-xl p-4 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto select-text">
            {generatedText}
          </div>
        </div>
      </div>

    </div>
  )
}
