import { NextResponse } from 'next/server';
import { getExpertsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { expertId, enrichmentData } = data;
    
    if (!expertId || !enrichmentData || !Array.isArray(enrichmentData)) {
      return NextResponse.json(
        { error: 'Missing required fields: expertId or enrichmentData' },
        { status: 400 }
      );
    }
    
    const expertsCollection = await getExpertsCollection();
    
    // Find the expert by ID
    let query = {};
    if (ObjectId.isValid(expertId)) {
      query = { _id: new ObjectId(expertId) };
    } else {
      query = { id: expertId };
    }
    
    const expert = await expertsCollection.findOne(query);
    
    if (!expert) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      );
    }
    
    // Update the expert with the enrichment data
    // We'll add the enrichment data to an 'aiEnrichment' field
    const result = await expertsCollection.updateOne(
      query,
      { 
        $set: { 
          aiEnrichment: enrichmentData,
          updatedAt: new Date()
        } 
      }
    );
    
    return NextResponse.json({
      success: true,
      message: 'AI enrichment data saved successfully',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error saving AI enrichment data:', error);
    return NextResponse.json(
      { error: 'Failed to save AI enrichment data' },
      { status: 500 }
    );
  }
}