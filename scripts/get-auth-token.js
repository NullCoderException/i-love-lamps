#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function getAuthToken() {
  try {
    console.log('=== Supabase Auth Token Generator ===\n');
    
    const email = await question('Enter your email: ');
    const password = await question('Enter your password: ');
    
    console.log('\nAuthenticating...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Authentication failed:', error.message);
      process.exit(1);
    }
    
    if (!data.session) {
      console.error('No session created');
      process.exit(1);
    }
    
    console.log('\nAuthentication successful!');
    console.log('\nYour JWT token (use this for API calls):');
    console.log(data.session.access_token);
    console.log('\nYour User ID (use this for direct migration):');
    console.log(data.user.id);
    console.log('\nAdd these to your .env.local:');
    console.log(`AUTH_TOKEN=${data.session.access_token}`);
    console.log(`MIGRATION_USER_ID=${data.user.id}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

getAuthToken();