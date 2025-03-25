// Script to run the convert-csv-to-json.js script with environment variables
import path from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Path to the script
const scriptPath = path.join(process.cwd(), 'scripts', 'convert-csv-to-json.js');

console.log(`Running script: ${scriptPath}`);

// Run the script with Node.js
const child = spawn('node', ['--experimental-json-modules', scriptPath], {
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  console.log(`Script exited with code ${code}`);
});

child.on('error', (err) => {
  console.error('Failed to start script:', err);
});