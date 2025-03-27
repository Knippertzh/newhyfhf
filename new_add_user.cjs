// Script to add a user to the MongoDB database
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// Function to hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function addUser() {
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

    // User details
    const email = 'luca.dishbrain@gmail.com';
    const password = 'Dishbrain2025!';
    const username = 'Luca';

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('User with this email already exists');
      await client.close();
      return;
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = {
      username,
      email,
      passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(user);
    console.log('User created with ID:', result.insertedId);

    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

addUser();
