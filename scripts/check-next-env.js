#!/usr/bin/env node
require('dotenv').config();

console.log('Checking how Next.js loads environment variables...');

// Check if environment variables are loaded directly
console.log('Direct access:');
console.log('- SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? '✅ Available' : '❌ Missing');
console.log('- SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? '✅ Available' : '❌ Missing');
console.log('- SPOTIFY_REFRESH_TOKEN:', process.env.SPOTIFY_REFRESH_TOKEN ? '✅ Available' : '❌ Missing');

// Run as part of next.js script
console.log('\nNext.js environment requires variables to be prefixed with NEXT_PUBLIC_ if they need to be accessible in the browser.');
console.log('For server-side API routes, regular environment variables work.');
console.log('\nMake sure your .env file is located at the root of your project (same level as package.json)');

console.log('\nTrying to load the .env file manually to verify it exists and has content:');
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env');

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  console.log(`✅ .env file exists with ${lines.length} non-empty, non-comment lines.`);
} catch (err) {
  console.error('❌ Error reading .env file:', err.message);
}

// Create a .env.local file to demonstrate loading from multiple sources
try {
  fs.writeFileSync(path.join(process.cwd(), '.env.local'), 'TEST_VAR=env_local_works\n', 'utf8');
  console.log('✅ Created .env.local file for testing');
} catch (err) {
  console.error('❌ Error creating .env.local file:', err.message);
}
