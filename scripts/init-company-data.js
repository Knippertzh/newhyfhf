// Script to initialize company data in MongoDB
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// MongoDB connection URI from environment variable
const uri = process.env.DISHBRAIN_MONGODB_URI;

if (!uri) {
  console.error('Please define the DISHBRAIN_MONGODB_URI environment variable in .env');
  process.exit(1);
}

// Sample company data for initialization
const companyData = [
  {
    name: 'DeepMind',
    description: 'DeepMind is an AI research lab founded in 2010 and acquired by Google in 2014. The company focuses on developing artificial general intelligence (AGI) through a combination of machine learning and systems neuroscience.',
    industry: 'Research',
    location: 'London, UK',
    foundedYear: 2010,
    website: 'deepmind.com',
    email: 'info@deepmind.com',
    employees: '1000+',
    specializations: ['Reinforcement Learning', 'Deep Learning', 'Neuroscience', 'Robotics'],
    keyAchievements: [
      'Developed AlphaGo, the first computer program to defeat a world champion in the game of Go',
      'Created AlphaFold, which solved the protein folding problem',
      'Pioneered various reinforcement learning techniques used across the industry',
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'OpenAI',
    description: 'OpenAI is an AI research and deployment company founded in 2015. Its mission is to ensure that artificial general intelligence (AGI) benefits all of humanity.',
    industry: 'Research & Products',
    location: 'San Francisco, USA',
    foundedYear: 2015,
    website: 'openai.com',
    email: 'info@openai.com',
    employees: '500+',
    specializations: ['Natural Language Processing', 'Generative AI', 'Reinforcement Learning', 'Multimodal AI'],
    keyAchievements: [
      'Developed GPT series of language models',
      'Created DALL-E for image generation from text',
      'Pioneered techniques for aligning AI systems with human values',
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Google AI',
    description: 'Google AI is Google\'s AI research division focused on advancing the state of the art in artificial intelligence and machine learning.',
    industry: 'Research & Products',
    location: 'Mountain View, USA',
    foundedYear: 2017,
    website: 'ai.google',
    email: 'ai-info@google.com',
    employees: '1000+',
    specializations: ['Computer Vision', 'Natural Language Processing', 'Machine Learning', 'AI Ethics'],
    keyAchievements: [
      'Developed TensorFlow, one of the most widely used machine learning frameworks',
      'Created breakthrough computer vision systems used in Google Photos and other products',
      'Pioneered transformer architectures for natural language processing',
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Anthropic',
    description: 'Anthropic is an AI safety company working to build reliable, interpretable, and steerable AI systems. Founded by former members of OpenAI, Anthropic focuses on developing AI that is helpful, harmless, and honest.',
    industry: 'Research & Products',
    location: 'San Francisco, USA',
    foundedYear: 2021,
    website: 'anthropic.com',
    email: 'info@anthropic.com',
    employees: '150+',
    specializations: ['AI Safety', 'Large Language Models', 'AI Alignment', 'Constitutional AI'],
    keyAchievements: [
      'Developed Claude, a conversational AI assistant',
      'Created Constitutional AI methodology',
      'Pioneered techniques for reducing harmful outputs from AI systems',
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function main() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dishbrain');
    const companiesCollection = db.collection('companies');
    
    // Check if companies already exist
    const existingCompanies = await companiesCollection.countDocuments();
    
    if (existingCompanies > 0) {
      console.log(`Found ${existingCompanies} existing companies in the database.`);
      console.log('Skipping initialization as data already exists.');
    } else {
      // Insert company data
      const result = await companiesCollection.insertMany(companyData);
      
      console.log(`Successfully initialized ${result.insertedCount} companies in the database.`);
      console.log('Inserted company IDs:', result.insertedIds);
    }
    
  } catch (error) {
    console.error('Error initializing company data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the main function
main().catch(console.error);