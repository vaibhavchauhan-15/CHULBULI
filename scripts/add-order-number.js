// Script to add orderNumber column and backfill existing orders
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function addOrderNumber() {
  // Get DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set')
    console.log('Run this script with: node scripts/add-order-number.js')
    process.exit(1)
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  })

  try {
    console.log('🔗 Connecting to database...')
    
    // Execute each statement directly
    console.log('📝 Adding orderNumber column...')
    
    // Step 1: Add column (allowing NULL initially)
    try {
      await pool.query('ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "orderNumber" integer')
      console.log('✓ Column added')
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('✓ Column already exists')
      } else {
        throw err
      }
    }
    
    // Step 2: Backfill existing orders
    console.log('📝 Backfilling order numbers for existing orders...')
    const updateResult = await pool.query(`
      WITH numbered_orders AS (
        SELECT 
          id,
          ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) as row_num
        FROM "Order"
        WHERE "orderNumber" IS NULL
      )
      UPDATE "Order"
      SET "orderNumber" = numbered_orders.row_num
      FROM numbered_orders
      WHERE "Order".id = numbered_orders.id
      RETURNING "Order".id
    `)
    console.log(`✓ Updated ${updateResult.rowCount} orders`)
    
    // Step 3: Make column NOT NULL
    console.log('📝 Setting NOT NULL constraint...')
    await pool.query('ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL')
    console.log('✓ Constraint added')
    
    // Step 4: Create index
    console.log('📝 Creating index...')
    await pool.query('CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order" USING btree ("orderNumber")')
    console.log('✓ Index created')
    
    // Step 5: Verify
    console.log('\n📊 Sample orders with new order numbers:')
    const verifyResult = await pool.query(`
      SELECT "orderNumber", "customerName", "totalPrice", "createdAt" 
      FROM "Order" 
      ORDER BY "orderNumber" ASC 
      LIMIT 10
    `)
    console.table(verifyResult.rows)
    
    console.log('\n✅ Successfully added orderNumber column and backfilled data!')
    console.log('🎉 All existing orders now have sequential order numbers')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

addOrderNumber()
