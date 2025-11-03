import { NextResponse } from "next/server"

// Helicone model registry public endpoint
const HELICONE_REGISTRY_URL = "https://api.helicone.ai/v1/public/model-registry/models"

/**
 * GET endpoint to fetch models from Helicone registry
 * This proxies the request server-side to avoid CORS issues in the browser
 */
export async function GET() {
  try {
    const response = await fetch(HELICONE_REGISTRY_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      // Next.js fetch API can use cache options
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Failed to fetch models from Helicone: ${response.status}`, detail: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Handle both response structures: direct models or wrapped in data
    if (data.data && data.data.models) {
      return NextResponse.json({
        models: data.data.models,
        total: data.data.total || data.data.models.length,
        filters: data.data.filters || { providers: [], authors: [], capabilities: [] }
      })
    }

    // Direct response structure
    if (data.models) {
      return NextResponse.json(data)
    }

    return NextResponse.json(
      { error: "Unexpected response structure from Helicone API" },
      { status: 500 }
    )
  } catch (error) {
    console.error("Error fetching models from Helicone:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch models",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

