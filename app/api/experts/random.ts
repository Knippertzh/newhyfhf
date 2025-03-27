import { NextResponse } from 'next/server';
import { getExpertsCollection, standardizeDocument } from '@/lib/mongodb';
import { MongoClient } from 'mongodb';

export async function GET(request: Request) {
  try {
    const collection = await getExpertsCollection();
    const count = await collection.countDocuments();
    
    if (count === 0) {
      // Return a fallback expert if no experts in database
      return NextResponse.json({
        _id: 'fallback-expert-id',
        personalInfo: {
          fullName: 'Example Expert',
          title: 'AI Specialist',
          image: '/placeholder-user.jpg'
        },
        institution: {
          name: 'Example Institution',
          position: 'Researcher'
        },
        expertise: {
          primary: ['Artificial Intelligence', 'Machine Learning'],
          secondary: ['Data Science']
        },
        specializations: ['AI Ethics', 'Neural Networks']
      });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const randomExpert = await collection.find().limit(1).skip(randomIndex).next();
    
    if (!randomExpert) {
      return NextResponse.json({
        _id: 'fallback-expert-id',
        personalInfo: {
          fullName: 'Example Expert',
          title: 'AI Specialist',
          image: '/placeholder-user.jpg'
        },
        institution: {
          name: 'Example Institution',
          position: 'Researcher'
        },
        expertise: {
          primary: ['Artificial Intelligence', 'Machine Learning'],
          secondary: ['Data Science']
        },
        specializations: ['AI Ethics', 'Neural Networks']
      });
    }

    const standardizedExpert = standardizeDocument(randomExpert);
    
    // Ensure required fields exist
    if (!standardizedExpert.personalInfo) {
      standardizedExpert.personalInfo = {};
    }
    
    if (!standardizedExpert.personalInfo.fullName) {
      standardizedExpert.personalInfo.fullName = 'Unnamed Expert';
    }
    
    if (!standardizedExpert.personalInfo.image) {
      standardizedExpert.personalInfo.image = '/placeholder-user.jpg';
    }
    
    if (!standardizedExpert.personalInfo.title) {
      standardizedExpert.personalInfo.title = 'AI Professional';
    }

    return NextResponse.json(standardizedExpert);
  } catch (error) {
    console.error('Error fetching random expert:', error);
    // Return a fallback expert on error
    return NextResponse.json({
      _id: 'fallback-expert-id',
      personalInfo: {
        fullName: 'Example Expert',
        title: 'AI Specialist',
        image: '/placeholder-user.jpg'
      },
      institution: {
        name: 'Example Institution',
        position: 'Researcher'
      },
      expertise: {
        primary: ['Artificial Intelligence', 'Machine Learning'],
        secondary: ['Data Science']
      },
      specializations: ['AI Ethics', 'Neural Networks']
    });
  }
}
