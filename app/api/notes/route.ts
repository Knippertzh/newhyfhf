import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('notes');
      const result = await collection.insertOne({ note, createdAt: new Date() });

      return res.status(201).json({ message: 'Note saved successfully', noteId: result.insertedId });
    } catch (error) {
      console.error('Error saving note:', error);
      return res.status(500).json({ error: 'Failed to save note' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
