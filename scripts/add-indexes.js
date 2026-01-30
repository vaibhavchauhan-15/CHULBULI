const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const databaseUrl = envContent.split('\n').find(line => line.startsWith('DATABASE_URL='))?.split('=')[1]?.trim();

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

async function addIndexes() {
  const client = await pool.connect();
  
  try {
    console.log('Creating indexes...\n');

    // Index 1: Category and Price for filtering
    console.log('Creating idx_products_category_price...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category_price 
      ON products(category, price);
    `);
    console.log('✅ Index idx_products_category_price created successfully\n');

    // Index 2: Featured products (partial index)
    console.log('Creating idx_products_featured...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_featured 
      ON products(featured) 
      WHERE featured = true;
    `);
    console.log('✅ Index idx_products_featured created successfully\n');

    console.log('All indexes created successfully! 🎉');
    
  } catch (error) {
    console.error('Error creating indexes:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

addIndexes();
