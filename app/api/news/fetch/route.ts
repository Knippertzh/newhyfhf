import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || 'AI';
  const max = searchParams.get('max') || '20';
  
  try {
    // Make sure we're using the correct environment variable name as defined in .env.local
    const apiKey = process.env.NEWSAPI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=${max}&apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch news from external API' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // NewsAPI.org returns data in a different structure than GNews
    // We need to transform it to match the expected format in the frontend
    if (data.articles) {
      // Keep the original structure but ensure it's compatible with the frontend
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: 'Unexpected API response format' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}