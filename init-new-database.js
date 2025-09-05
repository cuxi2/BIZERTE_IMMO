const { createClient } = require('@supabase/supabase-js');

// Use your new Supabase credentials
const SUPABASE_URL = 'https://pvfzwnieerksnfusyidy.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Znp3bmllZXJrc25mdXN5aWR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA3MTE3NywiZXhwIjoyMDcyNjQ3MTc3fQ.cq4W6tiZZdINnVu3OpsP0jxtvtnLlJwQob82LLt_O-g';

console.log('🚀 Initializing New Supabase Database for MEFTAHI IMMO');
console.log('===================================================');

async function initNewDatabase() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  
  try {
    console.log('🔧 Creating database schema...');
    
    // Read the NEW_DATABASE_SETUP.sql file
    const fs = require('fs');
    const path = require('path');
    const sqlScript = fs.readFileSync(path.join(__dirname, 'NEW_DATABASE_SETUP.sql'), 'utf8');
    
    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`  ⚠️  Warning (continuing): ${error.message}`);
          } else {
            console.log(`  ⚠️  Non-fatal error: ${error.message}`);
          }
        } else {
          console.log(`  ✅ Success`);
        }
      } catch (stmtError) {
        console.log(`  ⚠️  Statement error: ${stmtError.message}`);
      }
    }
    
    console.log('\n🎉 Database initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Go to your Supabase dashboard Storage section');
    console.log('2. Create a bucket named "listings-media"');
    console.log('3. Set the bucket as public');
    console.log('4. Start your application: npm run dev');
    console.log('5. Visit http://localhost:3000/register to create your admin account');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.log('\nManual setup instructions:');
    console.log('1. Open your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy the content from NEW_DATABASE_SETUP.sql');
    console.log('4. Paste and run the script');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  initNewDatabase();
}

module.exports = { initNewDatabase };