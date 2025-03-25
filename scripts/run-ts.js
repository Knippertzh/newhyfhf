#!/usr/bin/env node

/**
 * This is a helper script to run TypeScript files with ESM support
 * Usage: node run-ts.js <typescript-file>
 * Example: node run-ts.js scripts/add-jane-smith.ts
 */

import { spawnSync } from 'child_process';
import path from 'path';

// Get the TypeScript file path from command line arguments
const scriptPath = process.argv[2];

if (!scriptPath) {
  console.error('Please provide a TypeScript file path as an argument');
  process.exit(1);
}

// Resolve the absolute path to the TypeScript file
const absolutePath = path.resolve(process.cwd(), scriptPath);

// Run the TypeScript file using node with ts-node/esm loader
const result = spawnSync('node', [
  '--loader', 'ts-node/esm',
  absolutePath
], {
  stdio: 'inherit',
  shell: true
});

process.exit(result.status);