// Script to test MongoDB connection and check collections
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '.env.local' });

const uri = process.env.DISHBRAIN_MONGODB_URI;
console.log('MongoDB URI exists:', !!uri);

async function testConnection() {
  if (!uri) {
    console.error('DISHBRAIN_MONGODB_URI environment variable is not defined');
    return;
  }

  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    
    const db = client.db('dishbrain');
    console.log('Connected to database: dishbrain');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(coll => console.log(` - ${coll.name}`));
    
    // Check if expert collection exists and count documents
    const expertCollection = db.collection('expert');
    const expertCount = await expertCollection.countDocuments();
    console.log(`Expert collection has ${expertCount} documents`);
    
    // Check if companies collection exists and count documents
    const companiesCollection = db.collection('companies');
    const companiesCount = await companiesCollection.countDocuments();
    console.log(`Companies collection has ${companiesCount} documents`);
    
    // Try to fetch a random expert
    if (expertCount > 0) {
      const randomIndex = Math.floor(Math.random() * expertCount);
      const randomExpert = await expertCollection.find().limit(1).skip(randomIndex).next();
      console.log('Random expert sample:', randomExpert ? 'Found' : 'Not found');
      if (randomExpert) {
        console.log('Expert ID:', randomExpert._id);
        console.log('Expert has personalInfo:', !!randomExpert.personalInfo);
        if (randomExpert.personalInfo) {
          console.log('Expert has fullName:', !!randomExpert.personalInfo.fullName);
          console.log('Expert has image:', !!randomExpert.personalInfo.image);
          console.log('Expert has title:', !!randomExpert.personalInfo.title);
        }
      }
    }
    
    // Try to fetch a random company
    if (companiesCount > 0) {
      const randomIndex = Math.floor(Math.random() * companiesCount);
      const randomCompany = await companiesCollection.find().limit(1).skip(randomIndex).next();
      console.log('Random company sample:', randomCompany ? 'Found' : 'Not found');
      if (randomCompany) {
        console.log('Company ID:', randomCompany._id);
        console.log('Company has name:', !!randomCompany.name);
        console.log('Company has industry:', !!randomCompany.industry);
      }
    }
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

testConnection();