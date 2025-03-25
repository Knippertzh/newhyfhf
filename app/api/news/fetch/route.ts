import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || 'AI';
  const max = searchParams.get('max') || '20';
  
  try {
    // Make sure we're using the correct environment variable name as defined in .env.local
    const apiKey = process.env.GNEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=${max}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch news from external API' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}