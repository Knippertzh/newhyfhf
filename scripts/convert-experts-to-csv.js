// Script to convert expert JSON files from public/expertbackup to CSV format
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Function to flatten nested objects for CSV conversion
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) continue;
    
    const newKey = prefix ? `${prefix}_${key}` : key;
    
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      // Recursively flatten nested objects
      Object.assign(flattened, flattenObject(obj[key], newKey));
    } else if (Array.isArray(obj[key])) {
      // Handle arrays by joining elements with a delimiter
      if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
        // For arrays of objects (like education, publications, projects)
        flattened[newKey] = JSON.stringify(obj[key]);
      } else {
        // For arrays of primitives (like expertise)
        flattened[newKey] = obj[key].join('; ');
      }
    } else {
      // Handle primitive values
      flattened[newKey] = obj[key];
    }
  }
  
  return flattened;
}

// Function to escape CSV fields
function escapeCSV(field) {
  if (field === null || field === undefined) return '';
  
  const stringField = String(field);
  
  // If the field contains commas, quotes, or newlines, wrap it in quotes and escape any quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
}

async function convertExpertsToCSV() {
  console.log('Starting conversion of expert JSON files to CSV...');
  
  try {
    // Path to the backup directory
    const backupDir = path.join(process.cwd(), 'public', 'expertbackup');
    
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
    
    console.log(`Found ${files.length} JSON files in the backup directory`);
    
    // Array to store all experts
    let allExperts = [];
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(backupDir, file);
      console.log(`Processing file: ${file}`);
      
      try {
        // Read and parse the JSON file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let experts = JSON.parse(fileContent);
        
        // Ensure experts is an array
        if (!Array.isArray(experts)) {
          experts = [experts];
        }
        
        // Add experts to the array
        allExperts = allExperts.concat(experts);
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError);
      }
    }
    
    if (allExperts.length === 0) {
      console.log('No experts found in the JSON files');
      return;
    }
    
    console.log(`Found ${allExperts.length} experts in total`);
    
    // Flatten each expert object
    const flattenedExperts = allExperts.map(expert => flattenObject(expert));
    
    // Get all unique headers from all experts
    const headers = Array.from(
      new Set(
        flattenedExperts.flatMap(expert => Object.keys(expert))
      )
    ).sort();
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add each expert as a row
    for (const expert of flattenedExperts) {
      const row = headers.map(header => escapeCSV(expert[header] || '')).join(',');
      csvContent += row + '\n';
    }
    
    // Create a timestamp for the filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const csvFilename = `experts-${timestamp}.csv`;
    const csvFilePath = path.join(backupDir, csvFilename);
    
    // Write the CSV file
    fs.writeFileSync(csvFilePath, csvContent);
    
    console.log(`Successfully converted ${allExperts.length} experts to CSV: ${csvFilePath}`);
    
  } catch (error) {
    console.error('Error converting experts to CSV:', error);
  }
}

// Run the conversion function
convertExpertsToCSV().catch(console.error);