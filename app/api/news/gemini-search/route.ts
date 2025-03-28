import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Define Article type (consider moving to a shared types file)
interface Article {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt?: string | Date; // Gemini might provide publish date
}

const MODEL_NAME = "gemini-1.5-flash-latest"; // Updated model name
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Function to search news with Gemini
async function searchNewsWithGemini(expertName: string, days: number): Promise<Article[]> {
  console.log(`Performing Gemini search for "${expertName}" within the last ${days} days.`);

  const generationConfig = {
    temperature: 0.9, // Adjust as needed
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048, // Adjust as needed
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const prompt = `
    Find recent news articles about the AI expert "${expertName}" published within the last ${days} days. 
    Focus on significant news, achievements, or mentions.
    Return the results as a JSON array of objects. Each object should have the following keys: "title", "url", "description", "image" (if available, otherwise null), and "publishedAt" (in ISO 8601 format if available, otherwise null).
    If no relevant articles are found, return an empty JSON array [].
    Do not include any text before or after the JSON array. Ensure the output is valid JSON.

    Example format:
    [
      {
        "title": "Expert Name Makes Breakthrough in AI Research",
        "url": "https://example.com/news/expert-breakthrough",
        "description": "A summary of the recent breakthrough...",
        "image": "https://example.com/image.jpg",
        "publishedAt": "2024-03-20T10:00:00Z" 
      },
      {
        "title": "Expert Name Interviewed on AI Ethics",
        "url": "https://example.com/news/expert-interview",
        "description": "Expert Name discusses the ethical implications...",
        "image": null,
        "publishedAt": "2024-03-15T14:30:00Z"
      }
    ]
  `; // Added missing closing backtick

  try {
    // Removed safetySettings from the call to use defaults
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig, 
      // safetySettings, 
    });

    const response = result.response;
    const responseText = response.text();
    
    // Clean the response text to ensure it's just the JSON array
    // Use [\s\S] instead of . with s flag for broader compatibility
    const jsonMatch = responseText.match(/\[[\s\S]*\]/); 
    if (!jsonMatch) {
      console.warn("Gemini response did not contain a valid JSON array:", responseText);
      return []; // Return empty if no JSON array found
    }
    
    const jsonString = jsonMatch[0];

    try {
      const articles: Article[] = JSON.parse(jsonString);
      // Basic validation of parsed structure
      if (!Array.isArray(articles)) {
         console.warn("Parsed Gemini response is not an array:", articles);
         return [];
      }
      // Optionally add more validation for each article object's structure
      return articles;
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", parseError, "\nResponse Text:", jsonString);
      throw new Error("Failed to parse Gemini response.");
    }

  } catch (apiError: any) { // Use 'any' or a more specific error type if known
    console.error("Error calling Gemini API:", apiError);
    // Try to extract a more specific message from the error object
    const specificErrorMessage = apiError?.message || "An unknown error occurred during the API call.";
    // Re-throw a new error with potentially more details
    throw new Error(`Failed to fetch news from Gemini: ${specificErrorMessage}`); 
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expertName, days } = body;

    if (!expertName || typeof expertName !== 'string') {
      return NextResponse.json({ error: 'Expert name is required' }, { status: 400 });
    }
    
    if (days === undefined || typeof days !== 'number' || days <= 0) {
      return NextResponse.json({ error: 'Valid number of days is required' }, { status: 400 });
    }

    // Call the (placeholder) function to search news using Gemini
    const articles = await searchNewsWithGemini(expertName, days);

    return NextResponse.json({ articles });

  } catch (error: any) {
    console.error('Error in Gemini news search route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search news with Gemini' },
      { status: 500 }
    );
  }
}
