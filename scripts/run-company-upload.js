// Script to run the company data upload script with environment variables
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Path to the script we want to run
const scriptPath = path.join(process.cwd(), 'scripts', 'upload-company-data.js');

// Spawn a new Node.js process to run the script
const child = spawn('node', ['--experimental-modules', scriptPath], {
  stdio: 'inherit',
  env: process.env
});

// Handle process events
child.on('error', (error) => {
  console.error(`Error running script: ${error.message}`);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`Script exited with code ${code}`);
    process.exit(code);
  }
  console.log('Script completed successfully');
});