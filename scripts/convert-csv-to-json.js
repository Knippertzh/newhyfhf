// Script to convert expert CSV files from public/expertbackup to JSON format
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

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

async function convertCSVToJSON() {
  console.log('Starting conversion of expert CSV files to JSON...');
  
  try {
    // Path to the backup directory
    const backupDir = path.join(process.cwd(), 'public', 'expertbackup');
    
    // Check if directory exists
    if (!fs.existsSync(backupDir)) {
      console.error(`Backup directory ${backupDir} does not exist`);
      return;
    }
    
    // Get all CSV files in the backup directory
    const files = fs.readdirSync(backupDir).filter(file => file.endsWith('.csv'));
    
    if (files.length === 0) {
      console.log('No CSV files found in the backup directory');
      return;
    }
    
    console.log(`Found ${files.length} CSV files in the backup directory`);
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(backupDir, file);
      console.log(`Processing file: ${file}`);
      
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
        
        console.log(`Successfully converted ${experts.length} experts to JSON: ${jsonFilePath}`);
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError);
      }
    }
    
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
  }
}

// Run the conversion function
convertCSVToJSON().catch(console.error);