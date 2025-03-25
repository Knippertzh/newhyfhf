// Script to run the add-german-ai-experts.js script with environment variables
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Path to the script
const scriptPath = path.join(process.cwd(), 'scripts', 'add-german-ai-experts.js');

// Run the script with Node.js
const child = spawn('node', ['-r', 'dotenv/config', scriptPath], {
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  console.log(`Script exited with code ${code}`);
});

child.on('error', (err) => {
  console.error('Failed to start script:', err);
});