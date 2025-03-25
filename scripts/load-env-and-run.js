// Script to load environment variables and run add-alena-buyx-mongodb.js
import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env
dotenv.config({ path: resolve(process.cwd(), '.env') });

// Verify the environment variable is loaded
if (!process.env.DISHBRAIN_MONGODB_URI) {
  console.error('Failed to load DISHBRAIN_MONGODB_URI from .env');
  process.exit(1);
} else {
  console.log('Successfully loaded environment variables');
}

// Import and run the script
import './add-alena-buyx-mongodb.js';
