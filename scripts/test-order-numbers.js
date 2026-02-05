// Test to verify orderNumber field
const { Pool } = require('pg')

async function testOrderNumbers() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  try {
    const result = await pool.query(`
      SELECT id, "orderNumber", "customerName", "totalPrice", status 
      FROM "Order" 
      ORDER BY "orderNumber" DESC 
      LIMIT 5
    `)
    
    console.log('📊 Latest 5 orders with order numbers:')
    console.table(result.rows)
    
  } finally {
    await pool.end()
  }
}

testOrderNumbers()
