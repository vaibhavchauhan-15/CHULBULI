// Test database connection with new Session Pooler URL
const { Pool } = require('pg');

// Manually set the connection string for testing
const DATABASE_URL = 'postgresql://postgres.piqjlpxozrwfilkpiomg:Khushi%4012353@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  console.log('Testing database connection...');
  console.log('URL:', DATABASE_URL.replace(/:[^:]*@/, ':****@'));
  
  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('\nDatabase Info:');
    console.log('- PostgreSQL Version:', result.rows[0].version.split(' ')[0], result.rows[0].version.split(' ')[1]);
    console.log('- Database:', result.rows[0].current_database);
    console.log('- User:', result.rows[0].current_user);
    
    // Test a simple query
    const testQuery = await client.query('SELECT 1 + 1 as result');
    console.log('- Test Query Result:', testQuery.rows[0].result);
    
    client.release();
    await pool.end();
    console.log('\n✅ All tests passed! Database connection is working perfectly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testConnection();
