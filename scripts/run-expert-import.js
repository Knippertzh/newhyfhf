// Script to run both expert import scripts sequentially
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting expert import process...');
console.log('Current directory:', process.cwd());
console.log('Script directory:', __dirname);

// Function to execute a command and return a promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Run the scripts sequentially
async function runScripts() {
  try {
    // First run the upload-experts-from-json.js script
    console.log('\n=== Running upload-experts-from-json.js ===');
    await execPromise(`node --experimental-modules ${path.join(__dirname, 'upload-experts-from-json.js')}`);
    
    // Then run the process-all-expert-json.js script
    console.log('\n=== Running process-all-expert-json.js ===');
    await execPromise(`node --experimental-modules ${path.join(__dirname, 'process-all-expert-json.js')}`);
    
    console.log('\n=== All expert import scripts completed successfully ===');
  } catch (error) {
    console.error('Error running scripts:', error);
  }
}

// Run the scripts
runScripts();