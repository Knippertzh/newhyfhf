import { NextResponse } from 'next/server';
import { getCompaniesCollection, standardizeDocument } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    // Add logging to help diagnose issues
    console.log('Fetching random company from database');
    const collection = await getCompaniesCollection();
    const count = await collection.countDocuments();
    console.log(`Found ${count} companies in database`);
    
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

    // Create a deep copy of the company document to avoid modifying the original
    const companyData = JSON.parse(JSON.stringify(randomCompany));
    
    // Convert _id to id for frontend compatibility
    if (companyData._id && !companyData.id) {
      companyData.id = companyData._id;
    }
    
    // Ensure the company has all required fields
    if (!companyData) {
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
    
    // Ensure the company has at least a name
    if (!companyData.name) {
      console.warn('Company missing name:', companyData._id);
      companyData.name = 'Unnamed Company';
    }
    
    // Ensure the company has an industry
    if (!companyData.industry) {
      console.warn('Company missing industry:', companyData._id);
      companyData.industry = 'Technology';
    }
    
    // Ensure other important fields
    if (!companyData.description) {
      companyData.description = `A company in the ${companyData.industry} industry.`;
    }
    
    if (!companyData.location) {
      companyData.location = 'Global';
    }
    
    if (!companyData.logoUrl) {
      companyData.logoUrl = '/placeholder-logo.svg';
    }

    // Ensure we have an id field for frontend compatibility
    const responseCompany = {
      ...companyData,
      id: companyData.id || companyData._id
    };
    
    // Ensure expertCount field exists
    if (!responseCompany.expertCount) {
      responseCompany.expertCount = 0;
    }
    
    // Add additional logging to debug the response
    console.log('Returning company data:', responseCompany);
    
    // Ensure we're not returning an empty object
    if (!responseCompany || Object.keys(responseCompany).length === 0) {
      console.error('Empty company data detected, returning fallback');
      return NextResponse.json({
        id: 'fallback-company-id',
        name: 'Plugilo Inc',
        description: 'A leading AI bookmark and database tool',
        industry: 'Artificial Intelligence',
        location: 'Berlin, Germany',
        logoUrl: 'https://logo.clearbit.com/plugilo.com',
        website: 'https://plugilo.com',
        expertCount: 5
      }, { status: 200 }); // Explicitly set status to 200
    }
    
    // Return with explicit 200 status code to avoid any browser misinterpretation
    return NextResponse.json(responseCompany, { status: 200 });
  } catch (error) {
    console.error('Error fetching random company:', error);
    // Return a fallback company on error with explicit 200 status code
    return NextResponse.json({
      id: 'fallback-company-id',
      name: 'Example AI Company',
      description: 'A leading AI research and development company.',
      industry: 'Artificial Intelligence',
      location: 'Berlin, Germany',
      logoUrl: '/placeholder-logo.svg',
      website: 'https://example.com',
      expertCount: 5
    }, { status: 200 });
  }
}