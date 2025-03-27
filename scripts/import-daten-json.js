// Script to import experts from daten.json to MongoDB
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

async function importDatenJson() {
  console.log('Starting import of experts from daten.json...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dishbrain');
    const expertsCollection = db.collection('expert');
    
    // Path to the daten.json file
    const datenFilePath = path.join(process.cwd(), 'public', 'daten.json');
    
    // Check if file exists
    if (!fs.existsSync(datenFilePath)) {
      console.error(`daten.json file does not exist at ${datenFilePath}`);
      return;
    }
    
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(datenFilePath, 'utf8');
    // Replace NaN values with null before parsing
    const sanitizedContent = fileContent.replace(/: *NaN/g, ': null');
    const experts = JSON.parse(sanitizedContent);
    
    if (!Array.isArray(experts)) {
      console.error('daten.json does not contain an array of experts');
      return;
    }
    
    console.log(`Found ${experts.length} experts in daten.json`);
    
    let totalExperts = experts.length;
    let addedExperts = 0;
    let skippedExperts = 0;
    let errorExperts = 0;
    
    // Process each expert in the file
    for (const expertData of experts) {
      try {
        // Skip entries with NaN or empty values for essential fields
        if (!expertData.Vorname || !expertData.Nachname) {
          console.log('Skipping expert with missing name');
          skippedExperts++;
          continue;
        }
        
        // Normalize the expert data to match our schema
        const normalizedExpert = normalizeDatenExpert(expertData);
        
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
    
    console.log('\nImport Summary:');
    console.log(`Total experts found: ${totalExperts}`);
    console.log(`Experts added: ${addedExperts}`);
    console.log(`Experts skipped (duplicates or invalid): ${skippedExperts}`);
    console.log(`Errors: ${errorExperts}`);
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Function to normalize expert data from daten.json to match our schema
function normalizeDatenExpert(expertData) {
  // Create a new object with our expected schema
  const normalizedExpert = {
    personalInfo: {},
    institution: {},
    expertise: {},
    profiles: {},
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Handle personal information
  normalizedExpert.personalInfo = {
    title: expertData.Titel || null,
    firstName: expertData.Vorname || '',
    lastName: expertData.Nachname || '',
    fullName: `${expertData.Titel ? expertData.Titel + ' ' : ''}${expertData.Vorname || ''} ${expertData.Nachname || ''}`.trim(),
    email: expertData.Email || null,
    phone: expertData.Tel || null,
    // Generate a placeholder image path based on name
    image: `/experts/${(expertData.Vorname || '').toLowerCase()}-${(expertData.Nachname || '').toLowerCase()}.jpg`,
    languages: ['Deutsch'] // Assuming German as default language
  };
  
  // Handle institution data
  normalizedExpert.institution = {
    name: expertData.Company || '',
    position: expertData["Job Title"] || '',
    department: null,
    website: expertData["Homepage Link"] || null
  };
  
  // Handle expertise data
  const primaryExpertise = [];
  if (expertData["Field of Activity"]) {
    // Split by comma if multiple fields are provided
    const fields = expertData["Field of Activity"].split(',').map(field => field.trim());
    primaryExpertise.push(...fields);
  }
  
  normalizedExpert.expertise = {
    primary: primaryExpertise,
    secondary: [],
    industries: []
  };
  
  // Handle profiles/links
  normalizedExpert.profiles = {
    linkedin: expertData["LinkedIn Link"] || null,
    company: expertData["Homepage Link"] || null
  };
  
  // Add other links if available
  if (expertData["Other Links"]) {
    normalizedExpert.profiles.other = expertData["Other Links"];
  }
  
  // Add tags for better searchability
  normalizedExpert.tags = [...primaryExpertise];
  
  // Add company name as tag if available
  if (expertData.Company) {
    normalizedExpert.tags.push(expertData.Company);
  }
  
  // Add job title as tag if available
  if (expertData["Job Title"]) {
    normalizedExpert.tags.push(expertData["Job Title"]);
  }
  
  // Add comments if available
  if (expertData.Kommentar) {
    normalizedExpert.comments = expertData.Kommentar;
  }
  
  // Add prior company if available
  if (expertData["Prior Company"]) {
    normalizedExpert.priorCompany = expertData["Prior Company"];
  }
  
  // Add reference if available
  if (expertData["Referenz 1"]) {
    normalizedExpert.references = [{
      name: expertData["Referenz 1"],
      link: expertData["Referenz 1 Link"] || null
    }];
  }
  
  // Add address if available
  if (expertData.Adresse) {
    normalizedExpert.personalInfo.address = expertData.Adresse;
  }
  
  // Generate an ID based on name (for consistency with existing experts)
  const firstName = (expertData.Vorname || '').toLowerCase().replace(/\s+/g, '-');
  const lastName = (expertData.Nachname || '').toLowerCase().replace(/\s+/g, '-');
  normalizedExpert.id = `exp-${firstName}-${lastName}`;
  
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
  
  // Try by first name and last name combination
  if (expert.personalInfo?.firstName && expert.personalInfo?.lastName) {
    const existingByFirstLastName = await collection.findOne({
      'personalInfo.firstName': expert.personalInfo.firstName,
      'personalInfo.lastName': expert.personalInfo.lastName
    });
    
    if (existingByFirstLastName) return existingByFirstLastName;
  }
  
  return null;
}

// Run the import function
importDatenJson().catch(console.error);