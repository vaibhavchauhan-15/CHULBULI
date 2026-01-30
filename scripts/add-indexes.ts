import { sql } from 'drizzle-orm';
import { db } from '../src/lib/db/client';

async function addIndexes() {
  try {
    console.log('Creating database indexes...\n');

    // Index 1: Category and Price for filtering
    console.log('Creating idx_products_category_price...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_products_category_price 
      ON products(category, price);
    `);
    console.log('✅ Index idx_products_category_price created\n');

    // Index 2: Featured products (partial index)
    console.log('Creating idx_products_featured...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_products_featured 
      ON products(featured) 
      WHERE featured = true;
    `);
    console.log('✅ Index idx_products_featured created\n');

    // Optional: Create index for order queries
    console.log('Creating idx_orders_user_created...');
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_orders_user_created 
      ON orders(user_id, created_at DESC);
    `);
    console.log('✅ Index idx_orders_user_created created\n');

    console.log('🎉 All indexes created successfully!');
    console.log('\n📊 Performance improvement expected:');
    console.log('  - Product filtering: 3-5x faster');
    console.log('  - Featured products: 2-3x faster');
    console.log('  - User orders: 2-4x faster');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
}

addIndexes();
