import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { category, website, author, customInstruction, baseText } = await req.json()

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

    const systemPrompt = `You are an expert website copywriter and SEO content specialist.
Your task is to generate high-quality, engaging, and professional website copy for the following category: "${category}".
Target Website: "${website}"
Target Author: "${author}"

Guidelines:
1. Ensure the output is ready to publish.
2. Naturally incorporate the author name "${author}" and website name "${website}" if applicable to the category.
3. Keep the tone engaging, clear, and professional.
4. Do not include markdown codeblocks or unnecessary meta commentary; output ONLY the final text.`

    let userPrompt = `Category: ${category}
Website Name: ${website}
Author Name: ${author}`

    if (baseText) {
      userPrompt += `\n\nBase Template Text:\n"${baseText}"`
    }

    if (customInstruction) {
      userPrompt += `\n\nCustom Instructions:\n${customInstruction}`
    } else {
      userPrompt += `\n\nPlease generate a unique, highly compelling variation for this website and author.`
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
        max_tokens: 800
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
