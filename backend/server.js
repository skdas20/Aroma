const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDatabase } = require('./src/config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to PostgreSQL via Prisma
connectDatabase().catch((error) => {
  console.error(' Database connection failed:', error.message);
  process.exit(1);
});

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3001',
  'https://aroma-blush.vercel.app',
  'https://aroma-ipst.vercel.app',
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', require('./src/routes/products'));
app.use('/api/cart', require('./src/routes/cart'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/support', require('./src/routes/support'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/chatbot', require('./src/routes/chatbot'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Aroma Perfume Backend is running!',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL Connected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Aroma Perfume Backend running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:3000`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});