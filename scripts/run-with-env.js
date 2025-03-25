// Script to load environment variables and run add-alena-buyx-complete.js
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
// Also try loading from .env as fallback
dotenv.config({ path: resolve(process.cwd(), '.env') });

// Verify the environment variable is loaded
if (!process.env.DISHBRAIN_MONGODB_URI) {
  console.error('Failed to load DISHBRAIN_MONGODB_URI from .env.local');
  process.exit(1);
} else {
  console.log('Successfully loaded environment variables');
  console.log('MongoDB URI:', process.env.DISHBRAIN_MONGODB_URI.substring(0, 20) + '...');
}

// Import and run the script
import './add-alena-buyx-complete.js';