import { NextResponse } from 'next/server';

/**
 * API route to verify if a logo exists at Clearbit
 * This solves CORS issues by making the request server-side
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  
  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
  }
  
  try {
    // Clean the domain (remove protocol and path if present)
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const logoUrl = `https://logo.clearbit.com/${cleanDomain}`;
    
    // Make the request server-side to avoid CORS issues
    const response = await fetch(logoUrl, { method: 'HEAD' });
    
    if (response.ok) {
      return NextResponse.json({ success: true, logoUrl });
    } else {
      return NextResponse.json({ success: false }, { status: 404 });
    }
  } catch (error) {
    console.error('Error verifying logo:', error);
    return NextResponse.json({ error: 'Failed to verify logo' }, { status: 500 });
  }
}