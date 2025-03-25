import { NextRequest, NextResponse } from 'next/server';
import { getCompaniesCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/companies - Get all companies
export async function GET(request: NextRequest) {
  try {
    const companiesCollection = await getCompaniesCollection();
    const companies = await companiesCollection.find({}).toArray();
    
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create a new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }    
    if (!body.website) {
      return NextResponse.json(
        { error: 'Website is required' },
        { status: 400 }
      );
    }
    
    // Add timestamps and track logo verification status
    const companyData = {
      ...body,
      logoVerified: body.logoVerified || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const companiesCollection = await getCompaniesCollection();
    const result = await companiesCollection.insertOne(companyData);
    
    return NextResponse.json(
      { 
        _id: result.insertedId,
        ...companyData 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}