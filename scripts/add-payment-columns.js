// Add payment columns to Order table
const { Pool } = require('pg')

async function addPaymentColumns() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: databaseUrl })

  try {
    console.log('🔗 Connecting to database...')
    
    // Add payment columns
    await pool.query('ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentStatus" varchar(50) DEFAULT \'pending\' NOT NULL')
    console.log('✓ paymentStatus column added')
    
    await pool.query('ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "razorpayOrderId" text')
    console.log('✓ razorpayOrderId column added')
    
    await pool.query('ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "razorpayPaymentId" text')
    console.log('✓ razorpayPaymentId column added')
    
    await pool.query('ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "razorpaySignature" text')
    console.log('✓ razorpaySignature column added')
    
    await pool.query('CREATE INDEX IF NOT EXISTS "Order_paymentStatus_idx" ON "Order" ("paymentStatus")')
    console.log('✓ Index created')
    
    console.log('\n✅ All payment columns added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

addPaymentColumns()
