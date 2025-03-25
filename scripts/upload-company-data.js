// Script to upload mock company data to MongoDB
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection URI from environment variable
const uri = process.env.DATABASE_URL;

if (!uri) {
  console.error('Please define the DATABASE_URL environment variable in .env');
  process.exit(1);
}

// Mock company data
const companyData = [
  {
    name: 'TechNova AI',
    description: 'Leading provider of artificial intelligence solutions for enterprise businesses.',
    website: 'https://technova-ai.com',
    industry: 'Artificial Intelligence',
    foundedYear: 2018,
    headquarters: 'San Francisco, CA',
    logo: 'https://example.com/logos/technova.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'QuantumLeap Systems',
    description: 'Pioneering quantum computing technologies for solving complex computational problems.',
    website: 'https://quantumleapsystems.io',
    industry: 'Quantum Computing',
    foundedYear: 2015,
    headquarters: 'Boston, MA',
    logo: 'https://example.com/logos/quantumleap.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'NeuraTech',
    description: 'Developing brain-computer interfaces and neural implants for medical applications.',
    website: 'https://neuratech.health',
    industry: 'Neurotechnology',
    foundedYear: 2019,
    headquarters: 'Austin, TX',
    logo: 'https://example.com/logos/neuratech.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'EcoSmart Solutions',
    description: 'Creating sustainable AI-powered solutions for environmental monitoring and conservation.',
    website: 'https://ecosmartsolutions.org',
    industry: 'Environmental Technology',
    foundedYear: 2017,
    headquarters: 'Portland, OR',
    logo: 'https://example.com/logos/ecosmart.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'MediSync',
    description: 'AI-driven healthcare platform for personalized medicine and treatment optimization.',
    website: 'https://medisync.health',
    industry: 'Healthcare Technology',
    foundedYear: 2016,
    headquarters: 'Chicago, IL',
    logo: 'https://example.com/logos/medisync.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'CyberShield',
    description: 'Advanced cybersecurity solutions using AI to detect and prevent digital threats.',
    website: 'https://cybershield.io',
    industry: 'Cybersecurity',
    foundedYear: 2014,
    headquarters: 'Seattle, WA',
    logo: 'https://example.com/logos/cybershield.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'RoboIndustries',
    description: 'Developing autonomous robots for industrial automation and manufacturing.',
    website: 'https://roboindustries.com',
    industry: 'Robotics',
    foundedYear: 2013,
    headquarters: 'Detroit, MI',
    logo: 'https://example.com/logos/roboindustries.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'DataVerse Analytics',
    description: 'Big data analytics platform for business intelligence and predictive modeling.',
    website: 'https://dataverse-analytics.com',
    industry: 'Data Analytics',
    foundedYear: 2016,
    headquarters: 'New York, NY',
    logo: 'https://example.com/logos/dataverse.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'VirtualReality Innovations',
    description: 'Creating immersive VR/AR experiences for education, training, and entertainment.',
    website: 'https://vrinnovations.tech',
    industry: 'Virtual Reality',
    foundedYear: 2017,
    headquarters: 'Los Angeles, CA',
    logo: 'https://example.com/logos/vrinnovations.png',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'SmartCity Technologies',
    description: 'Developing IoT solutions for smart cities and urban infrastructure management.',
    website: 'https://smartcitytech.io',
    industry: 'Internet of Things',
    foundedYear: 2015,
    headquarters: 'Toronto, Canada',
    logo: 'https://example.com/logos/smartcity.png',
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
    const existingCompanies = await companiesCollection.find({}).toArray();
    
    if (existingCompanies.length > 0) {
      console.log(`Found ${existingCompanies.length} existing companies in the database.`);
      console.log('Do you want to add more companies? If not, please terminate the script.');
    }
    
    // Insert company data
    const result = await companiesCollection.insertMany(companyData);
    
    console.log(`Successfully inserted ${result.insertedCount} companies into the database.`);
    console.log('Inserted company IDs:', result.insertedIds);
    
  } catch (error) {
    console.error('Error uploading company data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the main function
main().catch(console.error);