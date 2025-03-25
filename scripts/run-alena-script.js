// Script to run add-alena-buyx-complete.js with proper environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Import and run the script
import './add-alena-buyx-complete.js';