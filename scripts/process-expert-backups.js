// Script to process all expert backup files (CSV and JSON) from public/expertbackup to MongoDB
import { MongoClient, ObjectId } from 'mongodb';
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

// Function to parse CSV content
function parseCSV(csvContent) {
  // Split the CSV content into lines
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  
  // Extract headers from the first line
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Parse each data row
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let insideQuotes = false;
    let currentValue = '';
    
    // Parse CSV values handling quoted fields with commas
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        if (insideQuotes && j + 1 < line.length && line[j + 1] === '"') {
          // Handle escaped quotes ("")
          currentValue += '"';
          j++; // Skip the next quote
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // End of value
        values.push(currentValue);
        currentValue = '';
      } else {
        // Add character to current value
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    // Create an object from headers and values
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      if (j < values.length) {
        obj[headers[j]] = values[j];
      }
    }
    
    data.push(obj);
  }
  
  return data;
}

// Function to convert CSV parsed data to our expert schema
function convertToExpertSchema(csvData) {
  return csvData.map(item => {
    // Create the expert object with our schema
    const expert = {
      personalInfo: {
        fullName: item.personalInfo_fullName || '',
        title: item.personalInfo_title || '',
        email: item.personalInfo_email || '',
        image: item.personalInfo_image || ''
      },
      institution: {
        name: item.institution_name || '',
        position: item.institution_position || '',
        department: item.institution_department || '',
        website: item.institution_website || ''
      },
      expertise: {
        primary: item.expertise_primary ? item.expertise_primary.split('; ') : [],
        secondary: item.expertise_secondary ? item.expertise_secondary.split('; ') : []
      },
      bio: item.bio || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Handle complex fields that are stored as JSON strings
    if (item.education) {
      try {
        expert.education = JSON.parse(item.education);
      } catch (e) {
        console.warn(`Could not parse education for ${expert.personalInfo.fullName}: ${e.message}`);
      }
    }
    
    if (item.publications) {
      try {
        expert.publications = JSON.parse(item.publications);
      } catch (e) {
        console.warn(`Could not parse publications for ${expert.personalInfo.fullName}: ${e.message}`);
      }
    }
    
    if (item.projects) {
      try {
        expert.projects = JSON.parse(item.projects);
      } catch (e) {
        console.warn(`Could not parse projects for ${expert.personalInfo.fullName}: ${e.message}`);
      }
    }
    
    // Add social media links if present
    if (item.website) expert.website = item.website;
    if (item.linkedin) expert.linkedin = item.linkedin;
    if (item.twitter) expert.twitter = item.twitter;
    
    return expert;
  });
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

// Function to convert CSV files to JSON
async function convertCSVFilesToJSON(backupDir) {
  console.log('\nStep 1: Converting CSV files to JSON...');
  
  // Get all CSV files in the backup directory
  const csvFiles = fs.readdirSync(backupDir).filter(file => file.endsWith('.csv'));
  
  if (csvFiles.length === 0) {
    console.log('No CSV files found in the backup directory');
    return [];
  }
  
  console.log(`Found ${csvFiles.length} CSV files in the backup directory`);
  
  const convertedJsonFiles = [];
  
  // Process each file
  for (const file of csvFiles) {
    const filePath = path.join(backupDir, file);
    console.log(`Processing CSV file: ${file}`);
    
    try {
      // Read the CSV file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse the CSV content
      const csvData = parseCSV(fileContent);
      
      console.log(`Parsed ${csvData.length} experts from CSV`);
      
      // Convert to our expert schema
      const experts = convertToExpertSchema(csvData);
      
      // Create a JSON filename based on the CSV filename
      const jsonFilename = file.replace('.csv', '.json');
      const jsonFilePath = path.join(backupDir, jsonFilename);
      
      // Write the JSON file
      fs.writeFileSync(jsonFilePath, JSON.stringify(experts, null, 2));
      
      console.log(`Successfully converted ${experts.length} experts to JSON: ${jsonFilename}`);
      convertedJsonFiles.push(jsonFilename);
    } catch (fileError) {
      console.error(`Error processing CSV file ${file}:`, fileError);
    }
  }
  
  return convertedJsonFiles;
}

// Function to process all JSON files and upload to MongoDB
async function processJSONFiles(backupDir, expertsCollection) {
  console.log('\nStep 2: Processing JSON files and uploading to MongoDB...');
  
  // Get all JSON files in the backup directory
  const jsonFiles = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.json'))
    // Exclude the sample-experts.json file
    .filter(file => file !== 'sample-experts.json');
  
  if (jsonFiles.length === 0) {
    console.log('No JSON files found in the backup directory (excluding sample-experts.json)');
    return { totalExperts: 0, addedExperts: 0, skippedExperts: 0, errorExperts: 0, processedFiles: 0 };
  }
  
  console.log(`Found ${jsonFiles.length} JSON files to process (excluding sample-experts.json)`);
  
  let totalExperts = 0;
  let addedExperts = 0;
  let skippedExperts = 0;
  let errorExperts = 0;
  let processedFiles = 0;
  
  // Process each file
  for (const file of jsonFiles) {
    const filePath = path.join(backupDir, file);
    console.log(`Processing JSON file ${processedFiles + 1}/${jsonFiles.length}: ${file}`);
    
    try {
      // Read and parse the JSON file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let experts = JSON.parse(fileContent);
      
      // Ensure experts is an array
      if (!Array.isArray(experts)) {
        experts = [experts];
      }
      
      totalExperts += experts.length;
      
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
      
      processedFiles++;
    } catch (fileError) {
      console.error(`Error processing JSON file ${file}:`, fileError);
    }
  }
  
  return { totalExperts, addedExperts, skippedExperts, errorExperts, processedFiles, totalFiles: jsonFiles.length };
}

// Main function to process all expert backup files
async function processExpertBackups() {
  console.log('Starting processing of all expert backup files...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('dishbrain');
    const expertsCollection = db.collection('expert');
    
    // Path to the backup directory
    const backupDir = path.join(process.cwd(), 'public', 'expertbackup');
    
    // Check if directory exists
    if (!fs.existsSync(backupDir)) {
      console.error(`Backup directory ${backupDir} does not exist`);
      return;
    }
    
    // Step 1: Convert CSV files to JSON
    const convertedFiles = await convertCSVFilesToJSON(backupDir);
    
    // Step 2: Process all JSON files and upload to MongoDB
    const results = await processJSONFiles(backupDir, expertsCollection);
    
    // Print summary
    console.log('\n=== PROCESSING SUMMARY ===');
    console.log(`CSV files converted to JSON: ${convertedFiles.length}`);
    console.log(`JSON files processed: ${results.processedFiles}/${results.totalFiles}`);
    console.log(`Total experts found: ${results.totalExperts}`);
    console.log(`Experts added to database: ${results.ad