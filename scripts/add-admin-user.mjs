// Script to add an admin user to the MongoDB database
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local file
config({ path: resolve(__dirname, '..', '.env.local') });

async function addAdminUser() {
  try {
    const uri = process.env.DISHBRAIN_MONGODB_URI;
    if (!uri) {
      console.error('DISHBRAIN_MONGODB_URI environment variable is not defined');
      return;
    }

    console.log('Connecting to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('dishbrain');
    const usersCollection = db.collection('users');

    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await client.close();
      return;
    }

    // Import the hashPassword function from auth.ts
    import { hashPassword } from '../lib/auth.ts';
    
    // Create admin user with hashed password
    const password = 'Dishbrain2025!';
    const passwordHash = await hashPassword(password);
    
    const adminUser = {
      username: 'Admin',
      email: 'admin@example.com',
      passwordHash: passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(adminUser);
    console.log('Admin user created with ID:', result.insertedId);

    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

addAdminUser();