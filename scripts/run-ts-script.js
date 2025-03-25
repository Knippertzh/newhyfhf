#!/usr/bin/env node

// This is a helper script to run TypeScript files directly
// It registers the ts-node compiler and then requires the specified TypeScript file

import { register } from 'ts-node';

register({
  transpileOnly: true,
  esm: true,
  experimentalSpecifierResolution: 'node'
});

// Get the TypeScript file path from command line arguments
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = new URL(`file://${resolve(__dirname, process.argv[2])}`).href;

if (!scriptPath) {
  console.error('Please provide a TypeScript file path as an argument');
  process.exit(1);
}

// Execute the TypeScript file
await import(scriptPath);
