import { NextResponse } from 'next/server';
import { getCompaniesCollection, standardizeDocument } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const collection = await getCompaniesCollection();
    const count = await collection.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomCompany = await collection.find().limit(1).skip(randomIndex).next();
    
    if (!randomCompany) {
      return NextResponse.json(
        { error: 'No company found' },
        { status: 404 }
      );
    }

    const standardizedCompany = standardizeDocument(randomCompany);
    
    // Validate the company data structure
    if (!standardizedCompany?.name ||
        !standardizedCompany?.industry) {
      return NextResponse.json(
        { error: 'Invalid company data structure - missing required fields' },
        { status: 500 }
      );
    }

    return NextResponse.json(standardizedCompany);
  } catch (error) {
    console.error('Error fetching random company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}