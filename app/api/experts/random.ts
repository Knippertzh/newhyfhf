import { NextResponse } from 'next/server';
import { getExpertsCollection, standardizeDocument } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getExpertsCollection();
    const count = await collection.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomExpert = await collection.find().limit(1).skip(randomIndex).next();
    
    if (!randomExpert) {
      return NextResponse.json(
        { error: 'No expert found' },
        { status: 404 }
      );
    }

    const standardizedExpert = standardizeDocument(randomExpert);
    
    // Validate the expert data structure
    if (!standardizedExpert?.personalInfo?.fullName ||
        !standardizedExpert?.personalInfo?.image ||
        !standardizedExpert?.personalInfo?.title) {
      return NextResponse.json(
        { error: 'Invalid expert data structure - missing required fields' },
        { status: 500 }
      );
    }

    return NextResponse.json(standardizedExpert);
  } catch (error) {
    console.error('Error fetching random expert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expert' },
      { status: 500 }
    );
  }
}
