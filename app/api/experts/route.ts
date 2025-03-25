import { NextResponse } from 'next/server';
import { getExpertsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query: any = {};
 
    if (searchParams.has('name')) {
      query["personalInfo.fullName"] = { $regex: searchParams.get('name'), $options: 'i' };
    }

    if (searchParams.has('specialization')) {
      query["specializations"] = { $in: [searchParams.get('specialization')] };
    }

    if (searchParams.has('company')) {
      query["institution.name"] = { $regex: searchParams.get('company'), $options: 'i' };
    }

    const expertsCollection = await getExpertsCollection();
const experts = await expertsCollection.find(query).toArray();

// Serialize MongoDB documents to plain objects
const serializedExperts = experts.map(expert => ({
  id: expert._id.toString(),
  name: expert.personalInfo?.fullName || "Unnamed Expert",
  title: expert.personalInfo?.title || "No Title",
  company: expert.institution?.name || "No Company",
  specialization: expert.expertise?.primary?.[0] || "General",
  imageUrl: expert.personalInfo?.image || "",
  email: expert.personalInfo?.email || ""
}));

    return NextResponse.json(serializedExperts);
  } catch (error) {
    console.error('Error fetching experts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const expertData = await request.json();
    
    // Validate required fields
    if (!expertData.userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }
    
    // Get the experts collection
    const expertsCollection = await getExpertsCollection();
    
    // Check if expert already exists with this userId
    const existingExpert = await expertsCollection.findOne({ userId: new ObjectId(expertData.userId) });
    
    if (existingExpert) {
      return NextResponse.json(
        { error: 'Expert with this userId already exists' },
        { status: 409 }
      );
    }
    
    // Add timestamps
    const now = new Date();
    const expertWithTimestamps = {
      ...expertData,
      userId: new ObjectId(expertData.userId),
      createdAt: now,
      updatedAt: now
    };
    
    // Insert the new expert
    const result = await expertsCollection.insertOne(expertWithTimestamps);
    
    // Return the created expert with serialized _id
    return NextResponse.json({
      ...expertWithTimestamps,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating expert:', error);
    return NextResponse.json(
      { error: 'Failed to create expert' },
      { status: 500 }
    );
  }
}
