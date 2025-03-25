// Script to export experts from MongoDB to JSON files in public/expertbackup
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection URI from environment variable
const uri = process.env.DISHBRAIN_MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  console.error('Please define the DISHBRAIN_MONGODB_URI or DATABASE_URL environment variable in .env');
  process.exit(1);
}

async function exportExpertsToBackup() {
  console.log('Starting expert export to backup files...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dishbrain');
    const expertsCollection = db.collection('expert');
    
    // Path to the backup directory
    const backupDir = path.join(process.cwd(), 'public', 'expertbackup');
    
    // Check if directory exists, create it if not
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`Created backup directory: ${backupDir}`);
    }
    
    // Get all experts from the collection
    const experts = await expertsCollection.find({}).toArray();
    
    if (experts.length === 0) {
      console.log('No experts found in the database');
      return;
    }
    
    console.log(`Found ${experts.length} experts in the database`);
    
    // Serialize the experts (convert ObjectId to string)
    const serializedExperts = experts.map(expert => {
      const serialized = { ...expert };
      
      // Convert _id to string
      if (serialized._id) {
        serialized._id = serialized._id.toString();
      }
      
      // Convert userId to string if it exists and is an ObjectId
      if (serialized.userId && typeof serialized.userId !== 'string') {
        serialized.userId = serialized.userId.toString();
      }
      
      return serialized;
    });
    
    // Create a timestamp for the filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `experts-backup-${timestamp}.json`;
    const filePath = path.join(backupDir, filename);
    
    // Write the experts to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(serializedExperts, null, 2));
    
    console.log(`Successfully exported ${experts.length} experts to ${filePath}`);
    
  } catch (error) {
    console.error('Error exporting experts:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the export function
exportExpertsToBackup().catch(console.error);