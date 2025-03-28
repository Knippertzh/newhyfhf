import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getExpertsCollection, standardizeDocument } from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // In Next.js App Router, params needs to be properly handled
    // The error suggests we need to await params before accessing its properties
    const { id } = await Promise.resolve(params);
    let query = {};

    // Add logging to help diagnose issues
    console.log('Fetching expert with ID:', id);

    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }

    const expertsCollection = await getExpertsCollection();
    const expert = await expertsCollection.findOne(query);

    if (!expert) {
      console.log('Expert not found with ID:', id);
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      );
    }

    console.log('Found expert, standardizing document');
    const standardizedExpert = standardizeDocument(expert);
    return NextResponse.json(standardizedExpert);
  } catch (error) {
    console.error('Error fetching expert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expert' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js App Router, params needs to be properly handled
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    
    // Add logging to help diagnose issues
    console.log('Updating expert with ID:', id);

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid expert ID' },
        { status: 400 }
      );
    }
    
    // Remove _id from update data if present
    const { _id, ...updateData } = body;
    
    // Add updated timestamp
    updateData.updatedAt = new Date();

    const expertsCollection = await getExpertsCollection();

    // Update expert document
    const result = await expertsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      );
    }

    // Return updated expert
    const updatedExpert = await expertsCollection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(standardizeDocument(updatedExpert));
  } catch (error) {
    console.error('Error updating expert:', error);
    return NextResponse.json(
      { error: 'Failed to update expert' },
      { status: 500 }
    );
  }
}
