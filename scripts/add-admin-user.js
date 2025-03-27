// Script to add an admin user to the MongoDB database
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

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

    // Create admin user
    const adminUser = {
      username: 'Admin',
      email: 'admin@example.com',
      passwordHash: 'Dishbrain2025!',
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