const { supabase, testConnection } = require('./config/supabase');

async function test() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('✅ Connection successful!');
      
      // Test advocates table
      const { data: advocates, error } = await supabase
        .from('advocates')
        .select('*')
        .limit(5);
      
      if (error) {
        console.log('❌ Database error:', error.message);
      } else {
        console.log(`📊 Found ${advocates.length} advocates`);
        advocates.forEach(a => {
          console.log(`   • ${a.name} - ${a.title}`);
        });
      }
    } else {
      console.log('❌ Connection failed');
    }
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

test();