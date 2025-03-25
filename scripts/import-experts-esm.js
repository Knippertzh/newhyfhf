// Script to import expert JSON files from public/expertbackup to MongoDB using ES modules
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection URI from environment variable
const uri = process.env.DISHBRAIN_MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  console.error('Please define the DISHBRAIN_MONGODB_URI or DATABASE_URL environment variable in .env');
  process.exit(1);
}

async function importExperts() {
  console.log('Starting expert import from JSON files...');
  console.log('Current directory:', process.cwd());
  console.log('Script directory:', __dirname);
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dishbrain');
    const expertsCollection = db.collection('expert');
    
    // Path to the backup directory
    const backupDir = path.join(process.cwd(), 'public', 'expertbackup');
    console.log('Looking for expert files in:', backupDir);
    
    // Check if directory exists
    if (!fs.existsSync(backupDir)) {
      console.error(`Backup directory ${backupDir} does not exist`);
      return;
    }
    
    // Get all JSON files in the backup directory
    const files = fs.readdirSync(backupDir).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.log('No JSON files found in the backup directory');
      return;
    }
    
    console.log(`Found ${files.length} JSON files in the backup directory:`);
    files.forEach(file => console.log(` - ${file}`));
    
    let totalExperts = 0;
    let addedExperts = 0;
    let skippedExperts = 0;
    let errorExperts = 0;
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(backupDir, file);
      console.log(`\nProcessing file: ${file}`);
      
      try {
        // Read and parse the JSON file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let experts = JSON.parse(fileContent);
        
        // Ensure experts is an array
        if (!Array.isArray(experts)) {
          experts = [experts];
        }
        
        totalExperts += experts.length;
        console.log(`Found ${experts.length} experts in file ${file}`);
        
        // Process each expert in the file
        for (const expertData of experts) {
          try {
            // Normalize the expert data to match our schema
            const normalizedExpert = normalizeExpertData(expertData);
            
            // Check if expert already exists by email or name
            const existingExpert = await findExistingExpert(expertsCollection, normalizedExpert);
            
            if (existingExpert) {
              console.log(`Expert ${normalizedExpert.personalInfo?.fullName || 'Unknown'} already exists, skipping...`);
              skippedExperts++;
              continue;
            }
            
            // Insert the expert into the database
            const result = await expertsCollection.insertOne(normalizedExpert);
            console.log(`Added expert ${normalizedExpert.personalInfo?.fullName || 'Unknown'} with ID: ${result.insertedId}`);
            addedExperts++;
          } catch (expertError) {
            console.error(`Error processing expert:`, expertError);
            errorExperts++;
          }
        }
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError);
      }
    }
    
    console.log('\nImport Summary:');
    console.log(`Total experts found: ${totalExperts}`);
    console.log(`Experts added: ${addedExperts}`);
    console.log(`Experts skipped (duplicates): ${skippedExperts}`);
    console.log(`Errors: ${errorExperts}`);
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Function to normalize expert data to match our schema
function normalizeExpertData(expertData) {
  // Create a new object with our expected schema
  const normalizedExpert = {
    personalInfo: {},
    institution: {},
    expertise: {},
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Handle different possible structures
  
  // Case 1: Data already follows our schema
  if (expertData.personalInfo) {
    normalizedExpert.personalInfo = expertData.personalInfo;
  } else {
    // Case 2: Flat structure with direct properties
    normalizedExpert.personalInfo = {
      fullName: expertData.name || expertData.fullName || 'Unknown',
      title: expertData.title || '',
      email: expertData.email || '',
      image: expertData.image || expertData.imageUrl || ''
    };
  }
  
  // Handle institution data
  if (expertData.institution) {
    normalizedExpert.institution = expertData.institution;
  } else {
    normalizedExpert.institution = {
      name: expertData.company || expertData.organization || expertData.institution || '',
      position: expertData.position || '',
      department: expertData.department || ''
    };
  }
  
  // Handle expertise data
  if (expertData.expertise) {
    normalizedExpert.expertise = expertData.expertise;
  } else {
    // Try to extract expertise from various possible fields
    const primaryExpertise = [];
    const secondaryExpertise = [];
    
    if (expertData.specialization) {
      primaryExpertise.push(expertData.specialization);
    }
    
    if (expertData.specializations && Array.isArray(expertData.specializations)) {
      primaryExpertise.push(...expertData.specializations);
    }
    
    if (expertData.skills && Array.isArray(expertData.skills)) {
      secondaryExpertise.push(...expertData.skills);
    }
    
    normalizedExpert.expertise = {
      primary: primaryExpertise,
      secondary: secondaryExpertise
    };
  }
  
  // Copy other fields that might be present
  if (expertData.bio) normalizedExpert.bio = expertData.bio;
  if (expertData.education) normalizedExpert.education = expertData.education;
  if (expertData.publications) normalizedExpert.publications = expertData.publications;
  if (expertData.projects) normalizedExpert.projects = expertData.projects;
  
  // Copy social media links if present
  if (expertData.website) normalizedExpert.website = expertData.website;
  if (expertData.linkedin) normalizedExpert.linkedin = expertData.linkedin;
  if (expertData.twitter) normalizedExpert.twitter = expertData.twitter;
  
  return normalizedExpert;
}

// Function to check if an expert already exists in the database
async function findExistingExpert(collection, expert) {
  // Try to find by email first (most reliable)
  if (expert.personalInfo?.email) {
    const existingByEmail = await collection.findOne({
      'personalInfo.email': expert.personalInfo.email
    });
    
    if (existingByEmail) return existingByEmail;
  }
  
  // Then try by full name
  if (expert.personalInfo?.fullName) {
    const existingByName = await collection.findOne({
      'personalInfo.fullName': expert.personalInfo.fullName
    });
    
    if (existingByName) return existingByName;
  }
  
  return null;
}

// Run the import function
importExperts().catch(console.error);