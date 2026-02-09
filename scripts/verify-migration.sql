-- Verify PhonePe migration results
SELECT 
  COUNT(*) as total_orders, 
  "paymentProvider", 
  "paymentMethod" 
FROM "Order" 
GROUP BY "paymentProvider", "paymentMethod"
ORDER BY "paymentProvider";
