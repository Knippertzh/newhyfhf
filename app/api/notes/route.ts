import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { note } = body;

    if (!note) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('notes');
    const result = await collection.insertOne({ note, createdAt: new Date() });

    return NextResponse.json({ message: 'Note saved successfully', noteId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
