/**
 * Add Google OAuth columns to User table
 * Run this script to manually add the required columns if migrations fail
 * 
 * Usage: node scripts/add-google-auth-columns.js
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const match = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

loadEnv();

async function addGoogleAuthColumns() {
  console.log('🔄 Adding Google OAuth columns to User table...\n');
  console.log('='.repeat(60));

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-google-auth-columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('\n📋 Executing SQL script...\n');

    // Execute the SQL
    const result = await client.query(sql);

    // Check if there are notices (from RAISE NOTICE in the SQL)
    if (client._notices) {
      client._notices.forEach(notice => {
        console.log(`  ℹ️  ${notice.message}`);
      });
    }

    console.log('\n✅ SQL script executed successfully!');

    // Verify the columns exist
    console.log('\n📋 Verifying User table structure...\n');
    const verifyResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'User'
      ORDER BY ordinal_position;
    `);

    console.log('User table columns:');
    verifyResult.rows.forEach(row => {
      const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultValue = row.column_default ? ` DEFAULT ${row.column_default}` : '';
      console.log(`  ✅ ${row.column_name} (${row.data_type}) ${nullable}${defaultValue}`);
    });

    // Check specifically for Google OAuth columns
    console.log('\n📋 Checking Google OAuth columns...\n');
    const oauthColumns = ['provider', 'googleId', 'photoUrl'];
    let allPresent = true;

    for (const col of oauthColumns) {
      const found = verifyResult.rows.find(row => row.column_name === col);
      if (found) {
        console.log(`  ✅ ${col} exists`);
      } else {
        console.log(`  ❌ ${col} missing`);
        allPresent = false;
      }
    }

    console.log('\n' + '='.repeat(60));
    if (allPresent) {
      console.log('\n✅ SUCCESS! All Google OAuth columns are present.');
      console.log('\nYou can now:');
      console.log('1. Restart your dev server: npm run dev');
      console.log('2. Test Google OAuth sign-in');
      console.log('3. User data will be saved correctly\n');
    } else {
      console.log('\n⚠️  Some columns are missing. Please check the errors above.\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the function
addGoogleAuthColumns().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
