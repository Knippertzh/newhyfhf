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
  
  // Create a deep copy to avoid modifying the original document
  const standardized = JSON.parse(JSON.stringify(doc));
  
  // Convert ObjectId to string
  if (doc._id && typeof doc._id === 'object') {
    standardized._id = doc._id.toString();
  }
  
  // Recursive function to process nested objects and arrays
  const processNestedFields = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      // Convert ObjectId to string
      if (key === '_id' && obj[key] && typeof obj[key] === 'object') {
        obj[key] = obj[key].toString();
      }
      
      // Convert Date objects to ISO strings
      if (obj[key] instanceof Date) {
        obj[key] = obj[key].toISOString();
      }
      // Process nested objects recursively
      else if (obj[key] && typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          // Process each item in the array
          obj[key].forEach((item: any) => {
            if (item && typeof item === 'object') {
              processNestedFields(item);
            }
          });
        } else {
          // Process nested object
          processNestedFields(obj[key]);
        }
      }
    });
  };
  
  // Process all nested fields
  processNestedFields(standardized);
  
  // Ensure arrays exist for expert-related array fields
  const expertArrayFields = ['specializations', 'education', 'publications', 'projects'];
  expertArrayFields.forEach(field => {
    if (!standardized[field]) {
      standardized[field] = [];
    }
  });
  
  // Handle company-specific fields
  if (standardized.name && typeof standardized.name === 'string') {
    // This is likely a company document
    if (!standardized.id && standardized._id) {
      standardized.id = standardized._id;
    }
    
    // Ensure company has required fields with defaults
    if (!standardized.industry) standardized.industry = 'Technology';
    if (!standardized.location) standardized.location = 'Global';
    if (!standardized.description) {
      standardized.description = `A company in the ${standardized.industry} industry.`;
    }
    if (!standardized.logoUrl) standardized.logoUrl = '/placeholder-logo.svg';
    if (!standardized.expertCount && standardized.expertCount !== 0) standardized.expertCount = 0;
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
