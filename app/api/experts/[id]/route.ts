import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getExpertsCollection, standardizeDocument } from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    let query = {};

    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }

    const expertsCollection = await getExpertsCollection();
    const expert = await expertsCollection.findOne(query);

    if (!expert) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      );
    }

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
    const { id } = await params;
    const body = await request.json();

    const expertsCollection = await getExpertsCollection();

    // Add updatedAt timestamp
    const updateData = {
      ...body,
      updatedAt: new Date()
    };

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
