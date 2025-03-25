// Script to run the convert-experts-to-csv.js script with environment variables
import path from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Path to the script
const scriptPath = path.join(process.cwd(), 'scripts', 'convert-experts-to-csv.js');

console.log(`Running script: ${scriptPath}`);

// Run the script with Node.js
const child = spawn('node', ['--experimental-json-modules', scriptPath], {
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  console.log(`Script exited with code ${code}`);
});