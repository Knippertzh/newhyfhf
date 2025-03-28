import { MongoClient, ObjectId } from 'mongodb'; // Import ObjectId
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DISHBRAIN_MONGODB_URI) {
  throw new Error('Please define the DISHBRAIN_MONGODB_URI environment variable');
}

const uri = process.env.DISHBRAIN_MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to get the dishbrain database
export async function getDishbrainDb() {
  const client = await clientPromise;
  return client.db('dishbrain');
}

// Helper function to get the experts collection
export async function getExpertsCollection() {
  const db = await getDishbrainDb();
  return db.collection('expert');
}

// Helper function to get the companies collection
export async function getCompaniesCollection() {
  const db = await getDishbrainDb();
  return db.collection('companies');
}

// Helper function to get the saved news collection
export async function getNewsCollection() {
  const db = await getDishbrainDb();
  return db.collection('saved_news');
}

// Helper function to get the users collection
export async function getUsersCollection() {
  const db = await getDishbrainDb();
  return db.collection('users');
}

// Standardize MongoDB document for frontend
export function standardizeDocument(doc: any) {
  if (!doc) return null;

  // Create a deep copy - this also converts ObjectId and Date to strings
  const standardized = JSON.parse(JSON.stringify(doc));

  // Ensure 'id' field exists, using the stringified _id
  if (standardized._id && !standardized.id) {
    standardized.id = standardized._id;
  }
  
  // The deep copy handles nested conversions. No need for complex recursion here.
  // Let the calling API routes handle defaults based on context.
  
  // Only apply expert-specific fields if the document appears to be an expert
  // (checking for personalInfo or other expert-specific fields)
  if (standardized.personalInfo || standardized.expertise || standardized.specializations) {
    // Ensure 'personalInfo' field exists for experts
    if (!standardized.personalInfo) {
      standardized.personalInfo = {};
    }

    // Ensure 'fullName', 'image', and 'title' fields exist within 'personalInfo'
    if (!standardized.personalInfo.fullName) {
      standardized.personalInfo.fullName = 'Unnamed Expert';
    }
    if (!standardized.personalInfo.image) {
      standardized.personalInfo.image = '/placeholder-user.jpg';
    }
    if (!standardized.personalInfo.title) {
      standardized.personalInfo.title = 'AI Professional';
    }
  }

  return standardized;
}

// Function to get a single expert by ID
export async function getExpertById(id: string) {
  if (!ObjectId.isValid(id)) {
    console.error('Invalid ObjectId format:', id);
    return null; // Or throw an error if preferred
  }
  
  try {
    const expertsCollection = await getExpertsCollection();
    const expertDoc = await expertsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!expertDoc) {
      return null;
    }
    
    // Standardize the document before returning
    return standardizeDocument(expertDoc);
  } catch (error) {
    console.error('Error fetching expert by ID:', error);
    // Re-throw the error or return null/handle as appropriate for your application
    // Throwing might be better to surface the DB error in the API route
    throw new Error('Database error while fetching expert by ID.'); 
  }
}
