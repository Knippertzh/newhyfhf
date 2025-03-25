import { NextRequest, NextResponse } from 'next/server';
import { getExpertsCollection, getCompaniesCollection, standardizeDocument } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const query = searchParams.get('query') || '';
    
    let results: any[] = [];
    
    // Create a case-insensitive regex for searching
    const searchRegex = new RegExp(query, 'i');
    
    // Search experts if type is 'experts' or 'all'
    if (type === 'experts' || type === 'all') {
      const expertsCollection = await getExpertsCollection();
      const experts = await expertsCollection.find({
        $or: [
          { name: { $regex: searchRegex } },
          { title: { $regex: searchRegex } },
          { company: { $regex: searchRegex } }
        ]
      }).limit(10).toArray();
      
      results = [...results, ...experts.map(expert => ({
        ...standardizeDocument(expert),
        type: 'expert'
      }))];
    }
    
    // Search companies if type is 'companies' or 'all'
    if (type === 'companies' || type === 'all') {
      const companiesCollection = await getCompaniesCollection();
      const companies = await companiesCollection.find({
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } }
        ]
      }).limit(10).toArray();
      
      results = [...results, ...companies.map(company => ({
        ...standardizeDocument(company),
        type: 'company'
      }))];
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}