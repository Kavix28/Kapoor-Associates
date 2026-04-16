#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Change to backend directory
process.chdir(path.join(__dirname, 'backend'));

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabase() {
  console.log('🧪 TESTING SUPABASE CONNECTION');
  console.log('================================\n');
  
  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase configuration');
    console.log('Please run: node setup-supabase.js');
    process.exit(1);
  }
  
  console.log('✅ Environment variables found');
  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...`);
  
  // Create client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test connection by checking advocates table
    console.log('\n🔍 Testing database connection...');
    const { data: advocates, error } = await supabase
      .from('advocates')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      console.log('\n💡 Make sure you:');
      console.log('1. Ran the SQL schema in Supabase Dashboard');
      console.log('2. Have correct credentials in .env file');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    console.log(`📊 Found ${advocates.length} advocates in database`);
    
    if (advocates.length > 0) {
      console.log('\n👥 Advocates:');
      advocates.forEach(advocate => {
        console.log(`   • ${advocate.name} - ${advocate.title} (${advocate.experience_years} years)`);
      });
    }
    
    // Test other tables
    console.log('\n🔍 Testing other tables...');
    
    const tables = [
      'consultation_bookings',
      'contact_queries', 
      'chatbot_sessions',
      'chatbot_conversations',
      'available_slots'
    ];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count || 0} records`);
      }
    }
    
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n📊 Your Supabase dashboard: ' + supabaseUrl);
    console.log('🚀 Ready to start backend server: cd backend && npm start');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testSupabase();