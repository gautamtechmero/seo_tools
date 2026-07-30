import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { category, website, author, customInstruction, baseText, mode, tone } = await req.json()

    const apiKey = process.env.AZURE_OPENAI_API_KEY
    let endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://mmuru-mc0in4xe-eastus2.cognitiveservices.azure.com/"
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5.4-nano"
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-12-01-preview"

    if (!apiKey) {
      return NextResponse.json(
        { error: "Azure OpenAI API Key is missing. Check .env.local configuration." },
        { status: 500 }
      )
    }

    // Ensure endpoint formatting without trailing slash
    endpoint = endpoint.replace(/\/$/, "")

    // Azure OpenAI chat completions URL
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`

    // Check if mode is batch package generation for all 5 categories
    if (mode === "package" || category === "All Categories") {
      const systemPrompt = `You are an expert website copywriter and SEO content specialist.
Your task is to generate complete, high-quality, professional website copy for a target website.
Target Website: "${website}"
Target Author: "${author}"
Tone/Style: "${tone || "Professional, engaging, and clear"}"

You MUST output ONLY a valid JSON object containing exact keys for all 5 content categories:
{
  "authorBoxTitle": "...",
  "authorBoxContent": "...",
  "disclaimerTitle": "...",
  "disclaimerContent": "...",
  "footerNotice": "..."
}

Guidelines for each section:
1. "authorBoxTitle": Short catchy section header like "Meet the Author, [Author]" or "A Note from [Author]".
2. "authorBoxContent": 2-3 short, engaging paragraphs introducing [Author] as the writer/researcher for [Website]. Mention the purpose of [Website] specifically tailored to what [Website] represents. End with a polite closing.
3. "disclaimerTitle": Clear heading like "Important Disclaimer" or "Legal Notice".
4. "disclaimerContent": 2-3 paragraphs stating that [Website] is an independent informational resource, not officially affiliated with or endorsed by third parties, trademarks belong to owners, content is for reference.
5. "footerNotice": 1-2 sentence copyright and independence statement for footer placement.

Output ONLY valid JSON. No markdown code blocks, no extra text.`

      const userPrompt = `Website Name: ${website}
Author Name: ${author}
${customInstruction ? `Custom Instructions: ${customInstruction}` : "Please generate a unique, context-aware website package for this brand and author."}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_completion_tokens: 1500
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Azure OpenAI API Error (Package Mode):", response.status, errorData)
        return NextResponse.json(
          {
            error: errorData.error?.message || `Azure OpenAI request failed with status ${response.status}`
          },
          { status: response.status }
        )
      }

      const data = await response.json()
      let rawContent = data.choices?.[0]?.message?.content || ""

      // Clean markdown formatting if present
      rawContent = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()

      try {
        const packageData = JSON.parse(rawContent)
        return NextResponse.json({
          success: true,
          package: packageData,
          modelUsed: deployment
        })
      } catch (parseErr) {
        console.error("Failed to parse JSON from AI response:", rawContent)
        return NextResponse.json(
          { error: "AI response was not valid JSON. Please try again." },
          { status: 500 }
        )
      }
    }

    // Single category mode
    const systemPrompt = `You are an expert website copywriter and SEO content specialist.
Your task is to generate high-quality, engaging, and professional website copy for the following category: "${category}".
Target Website: "${website}"
Target Author: "${author}"
Tone/Style: "${tone || "Professional, engaging, and clear"}"

Guidelines:
1. Ensure the output is ready to publish.
2. Naturally incorporate the author name "${author}" and website name "${website}" in context.
3. Tailor the content specifically to what "${website}" represents (do not use unrelated generic fallback topics like plasma donation unless relevant).
4. Do not include markdown codeblocks or unnecessary meta commentary; output ONLY the final ready-to-paste text.`

    let userPrompt = `Category: ${category}
Website Name: ${website}
Author Name: ${author}`

    if (baseText) {
      userPrompt += `\n\nBase Template Text:\n"${baseText}"`
    }

    if (customInstruction) {
      userPrompt += `\n\nCustom Instructions:\n${customInstruction}`
    } else {
      userPrompt += `\n\nPlease generate a unique, highly compelling variation tailored specifically for this website and author.`
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_completion_tokens: 800
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Azure OpenAI API Error:", response.status, errorData)
      return NextResponse.json(
        {
          error: errorData.error?.message || `Azure OpenAI request failed with status ${response.status}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || ""

    return NextResponse.json({
      success: true,
      resultText: generatedText,
      modelUsed: deployment
    })
  } catch (error: any) {
    console.error("Internal API error:", error)
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while communicating with Azure OpenAI." },
      { status: 500 }
    )
  }
}
