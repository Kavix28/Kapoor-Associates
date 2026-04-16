#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 SUPABASE SETUP FOR KAPOOR & ASSOCIATES');
console.log('==========================================\n');

console.log('Please complete these steps first:');
console.log('1. Go to https://supabase.com');
console.log('2. Create a new project');
console.log('3. Go to SQL Editor and run the schema from supabase-schema.sql');
console.log('4. Get your project credentials from Settings > API\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupSupabase() {
  try {
    console.log('📝 Enter your Supabase project details:\n');
    
    const supabaseUrl = await askQuestion('Supabase Project URL (https://your-project-id.supabase.co): ');
    const anonKey = await askQuestion('Supabase Anon Key: ');
    const serviceKey = await askQuestion('Supabase Service Role Key: ');
    
    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.log('❌ All fields are required. Please try again.');
      process.exit(1);
    }
    
    // Read existing .env.example
    const envExamplePath = path.join(__dirname, 'backend', '.env.example');
    const envPath = path.join(__dirname, 'backend', '.env');
    
    let envContent = '';
    if (fs.existsSync(envExamplePath)) {
      envContent = fs.readFileSync(envExamplePath, 'utf8');
    }
    
    // Update Supabase configuration
    envContent = envContent.replace(
      /SUPABASE_URL=.*/,
      `SUPABASE_URL=${supabaseUrl}`
    );
    envContent = envContent.replace(
      /SUPABASE_ANON_KEY=.*/,
      `SUPABASE_ANON_KEY=${anonKey}`
    );
    envContent = envContent.replace(
      /SUPABASE_SERVICE_ROLE_KEY=.*/,
      `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`
    );
    
    // Add DB_TYPE if not present
    if (!envContent.includes('DB_TYPE=')) {
      envContent = envContent.replace(
        /# Database/,
        '# Database\nDB_TYPE=supabase'
      );
    } else {
      envContent = envContent.replace(
        /DB_TYPE=.*/,
        'DB_TYPE=supabase'
      );
    }
    
    // Write .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Configuration saved to backend/.env');
    console.log('\n🎯 Next steps:');
    console.log('1. Make sure you ran the SQL schema in Supabase');
    console.log('2. Start the backend server: cd backend && npm start');
    console.log('3. Check for "✅ Supabase connected successfully" message');
    console.log('\n📊 Your Supabase dashboard: ' + supabaseUrl);
    console.log('📋 Access your data at: ' + supabaseUrl + '/project/default/editor');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupSupabase();