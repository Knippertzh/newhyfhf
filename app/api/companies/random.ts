import { NextResponse } from 'next/server';
import { getCompaniesCollection, standardizeDocument } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const collection = await getCompaniesCollection();
    const count = await collection.countDocuments();
    
    if (count === 0) {
      // Return a fallback company if no companies in database
      return NextResponse.json({
        _id: 'fallback-company-id',
        name: 'plugilo inc',
        description: 'A leading AI research and development company.',
        industry: 'Artificial Intelligence',
        location: 'Berlin, Germany',
        logoUrl: 'https://logo.clearbit.com/plugilo.com',
        website: 'https://plugilo.com',
        expertCount: 5
      });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const randomCompany = await collection.find().limit(1).skip(randomIndex).next();
    
    if (!randomCompany) {
      return NextResponse.json({
        _id: 'fallback-company-id',
        name: 'Example AI Company',
        description: 'A leading AI research and development company.',
        industry: 'Artificial Intelligence',
        location: 'Berlin, Germany',
        logoUrl: '/placeholder-logo.svg',
        website: 'https://example.com',
        expertCount: 5
      });
    }

    const standardizedCompany = standardizeDocument(randomCompany);
    
    // Ensure the company has all required fields
    if (!standardizedCompany) {
      return NextResponse.json({
        id: 'fallback-company-id',
        name: 'Plugilo Inc',
        description: 'A leading AI bookmark and database tool',
        industry: 'Artificial Intelligence',
        location: 'Berlin, Germany',
        logoUrl: 'https://logo.clearbit.com/plugilo.com',
        website: 'https://plugilo.com',
        expertCount: 5
      });
    }
    
    // Convert _id to id for frontend compatibility
    if (standardizedCompany._id && !standardizedCompany.id) {
      standardizedCompany.id = standardizedCompany._id;
    }
    
    // Ensure the company has at least a name
    if (!standardizedCompany.name) {
      console.warn('Company missing name:', standardizedCompany._id);
      standardizedCompany.name = 'Unnamed Company';
    }
    
    // Ensure the company has an industry
    if (!standardizedCompany.industry) {
      console.warn('Company missing industry:', standardizedCompany._id);
      standardizedCompany.industry = 'Technology';
    }
    
    // Ensure other important fields
    if (!standardizedCompany.description) {
      standardizedCompany.description = `A company in the ${standardizedCompany.industry} industry.`;
    }
    
    if (!standardizedCompany.location) {
      standardizedCompany.location = 'Global';
    }
    
    if (!standardizedCompany.logoUrl) {
      standardizedCompany.logoUrl = '/placeholder-logo.svg';
    }

    // Ensure we have an id field for frontend compatibility
    const responseCompany = {
      ...standardizedCompany,
      id: standardizedCompany.id || standardizedCompany._id
    };
    
    return NextResponse.json(responseCompany);
  } catch (error) {
    console.error('Error fetching random company:', error);
    // Return a fallback company on error
    return NextResponse.json({
      _id: 'fallback-company-id',
      name: 'Example AI Company',
      description: 'A leading AI research and development company.',
      industry: 'Artificial Intelligence',
      location: 'Berlin, Germany',
      logoUrl: '/placeholder-logo.svg',
      website: 'https://example.com',
      expertCount: 5
    });
  }
}