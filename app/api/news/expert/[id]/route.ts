import { NextRequest, NextResponse } from 'next/server';
import { getExpertById } from '@/lib/mongodb'; // Assuming getExpertById now exists and works

// Define Article type (consider moving to a shared types file)
interface Article {
  title: string;
  description?: string;
  url: string;
  image?: string;
  urlToImage?: string; // From NewsAPI
  savedAt?: Date | string; // From our saved data
  // Add other relevant fields if needed
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // In Next.js App Router, params needs to be properly handled
  // The error suggests we need to await params before accessing its properties
  const { id } = await Promise.resolve(params);
  
  if (!id) {
    return NextResponse.json(
      { error: 'Expert ID is required' },
      { status: 400 }
    );
  } // Added missing closing brace for the if (!id) block

  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source'); // Get the source query parameter

  try {
    // Get expert details
    const expert = await getExpertById(id);
    
    if (!expert) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      );
    }

    // --- Get Saved News from Expert Document ---
    const savedNews: Article[] = expert.savedNews || [];

    // If only saved news is requested, return it immediately
    if (source === 'saved') {
      return NextResponse.json({
        saved: savedNews,
        external: [], // Return empty array for external when only saved is requested
        externalApiError: null
      });
    }

    // --- Fetch External News (Only if source is not 'saved') ---
    const expertName = expert.personalInfo?.fullName || expert.name || '';
    const companyName = expert.institution?.name || expert.company || '';
    const specializations = expert.specializations || [];
    const primaryExpertise = expert.expertise?.primary || [];
    
    // Combine terms for a more targeted search
    const searchTerms = [
      expertName,
      companyName,
      ...specializations.slice(0, 3),
      ...primaryExpertise.slice(0, 3),
      'AI' // Always include AI as a term since this is an AI expert database
    ].filter(Boolean);
    
    // Create a search query string, prioritizing expert name and company
    const searchQuery = searchTerms.join(' ');
    
    // Fetch from external news API
    const apiKey = process.env.NEWSAPI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    let externalArticles: Article[] = [];
    let externalError: string | null = null;

    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&pageSize=10&apiKey=${apiKey}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        externalError = errorData.message || 'Failed to fetch news from external API';
        console.error(`NewsAPI Error (${response.status}):`, externalError);
      } else {
        const data = await response.json();
        // Map external articles to our Article interface
        externalArticles = (data.articles || []).map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage, // Map urlToImage to image
          // Add other fields if necessary
        }));
      }
    } catch (fetchError: any) {
      console.error('Error fetching from NewsAPI:', fetchError);
      externalError = fetchError.message || 'Network error fetching external news.';
    }

    // --- Combine and Return ---
    // Filter out external articles that might already be saved (based on URL)
    const savedUrls = new Set(savedNews.map(article => article.url));
    const uniqueExternalArticles = externalArticles.filter(article => !savedUrls.has(article.url));

    return NextResponse.json({
      saved: savedNews,
      external: uniqueExternalArticles,
      externalApiError: externalError // Include any error from the external API call
    });

  } catch (error: any) { // Catch errors fetching the expert itself
    console.error('Error fetching expert or saved news:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
