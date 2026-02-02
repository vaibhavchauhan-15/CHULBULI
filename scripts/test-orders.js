// Test script to check orders in database
const { Pool } = require('pg')

async function testOrders() {
  // Get DATABASE_URL from environment variable
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not set. Please set it in your environment.')
    console.log('You can run: set DATABASE_URL=your_database_url && node test-orders.js')
    return
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  })

  try {
    console.log('Connecting to database...')
    
    // Check if orders table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Order'
      );
    `)
    console.log('Order table exists:', tableCheck.rows[0].exists)

    // Count orders
    const countResult = await pool.query('SELECT COUNT(*) FROM "Order"')
    console.log('Total orders in database:', countResult.rows[0].count)

    // Fetch all orders
    const ordersResult = await pool.query(`
      SELECT id, "userId", "totalPrice", status, "customerName", "customerEmail", "createdAt"
      FROM "Order"
      ORDER BY "createdAt" DESC
      LIMIT 10
    `)
    console.log('\nRecent orders:')
    ordersResult.rows.forEach(order => {
      console.log(`- Order ${order.id.substring(0, 8)}: ${order.customerName}, Total: ₹${order.totalPrice}, Status: ${order.status}, Created: ${order.createdAt}`)
    })

    // Check order items
    const itemsResult = await pool.query(`
      SELECT COUNT(*) FROM "OrderItem"
    `)
    console.log('\nTotal order items:', itemsResult.rows[0].count)

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

testOrders()
