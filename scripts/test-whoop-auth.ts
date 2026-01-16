#!/usr/bin/env bun

const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID;
const WHOOP_CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;

console.log('Testing different auth methods...\n');

// Test 1: Body parameters only
console.log('Test 1: Client credentials in body');
try {
  const response1 = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: WHOOP_CLIENT_ID!,
      client_secret: WHOOP_CLIENT_SECRET!,
    }),
  });
  console.log('Status:', response1.status);
  const data1 = await response1.text();
  console.log('Response:', data1);
} catch (e) {
  console.log('Error:', e);
}

console.log('\n---\n');

// Test 2: Basic auth only
console.log('Test 2: Basic auth header');
const credentials = btoa(`${WHOOP_CLIENT_ID}:${WHOOP_CLIENT_SECRET}`);
try {
  const response2 = await fetch('https://api.prod.whoop.com/oauth/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });
  console.log('Status:', response2.status);
  const data2 = await response2.text();
  console.log('Response:', data2);
} catch (e) {
  console.log('Error:', e);
}

console.log('\n---\n');
console.log('Client ID length:', WHOOP_CLIENT_ID?.length);
console.log('Client Secret length:', WHOOP_CLIENT_SECRET?.length);
console.log('Client ID starts with:', WHOOP_CLIENT_ID?.substring(0, 8));
