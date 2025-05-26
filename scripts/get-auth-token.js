#!/usr/bin/env node

/**
 * Helper script to get a Supabase auth token for API testing
 * 
 * Usage:
 * 1. Update the email and password below
 * 2. Run: node scripts/get-auth-token.js
 * 3. Copy the token and use it in your HTTP file
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

// Update these with your test account credentials
const TEST_EMAIL = 'your-test-email@example.com'
const TEST_PASSWORD = 'your-test-password'

async function getAuthToken() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    })
    
    if (error) {
      console.error('Error signing in:', error.message)
      return
    }
    
    if (data.session) {
      console.log('Access Token:')
      console.log(data.session.access_token)
      console.log('\nToken expires at:', new Date(data.session.expires_at * 1000).toLocaleString())
      console.log('\nCopy the access token above and use it in your HTTP file as:')
      console.log('Authorization: Bearer <token>')
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

getAuthToken()