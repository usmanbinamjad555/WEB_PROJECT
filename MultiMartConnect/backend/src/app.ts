import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createClient } from 'redis'; // Direct atomic connection hook for the cart layer
import orderRouter from './modules/orders/routes/order.routes';

const app = express();

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ⚡ Dynamic Redis Cart Cache Client Instantiation
const redisCartClient = createClient();
redisCartClient.on('error', (err) => console.error('Redis Cart Engine Sync Error:', err));
redisCartClient.connect().then(() => {
  console.log('⚡ Dedicated Redis Cart Caching Stream Initialized Securely.');
});

// Health Check API Manifest
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Structural Domain Routing Mounting Pipeline
app.use('/api/v1/orders', orderRouter);

// =========================================================================
// 🛒 REAL-TIME REDIS MULTI-TENANT CART CACHE ENGINES
// =========================================================================

// Route A: Synchronize and Backup User Basket to Redis Memory Core
app.post('/api/cart', async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'Cannot synchronize cart. Explicit userId parameter required.' });
    }

    // Save user items array as a stringified JSON object with a 7-day automatic expiry
    await redisCartClient.set(`cart:${userId}`, JSON.stringify(cartItems || []), {
      EX: 604800 // 7 days in seconds
    });

    return res.status(200).json({ success: true, message: 'Shopping basket securely synchronized with Redis cluster memory.' });
  } catch (error) {
    console.error('Redis Backup Engine Fault:', error);
    return res.status(500).json({ error: 'Internal server error processing caching pipeline.' });
  }
});

// Route B: Fetch and Recover Cached Cart Records Instantly Upon Refresh
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cachedData = await redisCartClient.get(`cart:${userId}`);

    if (!cachedData) {
      // If no cache exists yet, safely return an empty basket array to the storefront
      return res.status(200).json([]);
    }

    return res.status(200).json(JSON.parse(cachedData));
  } catch (error) {
    console.error('Redis Cache Recovery Fault:', error);
    return res.status(500).json({ error: 'Internal server error retrieving cache records.' });
  }
});

// =========================================================================

// Fallback handling logic matching undefined request interfaces
app.use((req, res) => {
  res.status(404).json({ error: 'Requested API execution pathway does not exist.' });
});

export default app;