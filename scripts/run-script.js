#!/usr/bin/env node

// This script serves as a wrapper to run TypeScript files with the correct configuration
// Usage: node run-script.js <typescript-file>

const { spawn } = require('child_process');
const path = require('path');

// Get the TypeScript file path from command line arguments
const scriptPath = process.argv[2];

if (!scriptPath) {
  console.error('Please provide a TypeScript file path as an argument');
  process.exit(1);
}

// Resolve the absolute path to the TypeScript file
const absolutePath = path.resolve(process.cwd(), scriptPath);

// Run the TypeScript file using node with ts-node/esm loader
const child = spawn('node', [
  '--loader', 'ts-node/esm',
  absolutePath
], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  process.exit(code);
});