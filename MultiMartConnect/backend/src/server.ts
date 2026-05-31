import http from 'http';
import app from './app';
import { DatabaseConfig } from './config/db.config';
import { SocketEngine } from './services/socket.service';
import { RedisConfig } from './config/redis.config';
import { KafkaProducerService } from './services/producer.service';

const PORT = 8000;
const server = http.createServer(app);

async function bootSystemCluster(): Promise<void> {
  try {
    console.log('🔄 Initiating native core cluster drivers...');

    // 1. Connect MongoDB Mongoose natively (CRITICAL)
    await DatabaseConfig.connect();

    // 2. Fire up Caching configuration engines (OPTIONAL BYPASS)
    let redisClient: any = null;
    try {
      redisClient = await RedisConfig.getClient();
      console.log('⚡ Redis Client successfully attached to clustering pipeline.');
    } catch (redisError) {
      console.warn('⚠️ Redis Caching engine skipped. Proceeding with database direct routes.');
    }
    
    // 3. Mount Apache Kafka messaging brokers
    try {
      const kafkaProducer = new KafkaProducerService();
      await kafkaProducer.connect();
    } catch (kafkaError) {
      console.warn('⚠️ Kafka streaming broker offline. Event emitting paused.');
    }

    // 4. Wrap cluster server layer with instant WebSocket engines
    const socketEngine = SocketEngine.getInstance();
    socketEngine.initialize(server);

    // ===================================================
    // 💾 REDIS REAL-TIME CART PERSISTENCE ENDPOINTS
    // ===================================================

    // Endpoint A: Synchronize and backup cart array into Redis cache
    app.post('/api/cart', async (req: any, res: any) => {
      try {
        const { userId, cartItems } = req.body;

        if (!redisClient) {
          return res.status(503).json({ error: 'Redis clustering engine is offline.' });
        }

        // Store the cart as a serialized string mapped to the user identity string
        await redisClient.set(`cart:${userId}`, JSON.stringify(cartItems));
        return res.status(200).json({ message: 'Cart synchronized with Redis successfully!' });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // Endpoint B: Fetch cached cart back from Redis immediately on layout refresh
    app.get('/api/cart/:userId', async (req: any, res: any) => {
      try {
        const { userId } = req.params;

        if (!redisClient) {
          return res.status(503).json({ error: 'Redis clustering engine is offline.' });
        }

        const savedCart = await redisClient.get(`cart:${userId}`);
        
        // If an active session payload exists, parse it; otherwise return a clean slate array
        return res.status(200).json(savedCart ? JSON.parse(savedCart) : []);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    });

    // ===================================================

    // 5. Initialize port 8000 listener
    server.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`🚀 MultiMart Connect Server is LIVE on Port: ${PORT}`);
      console.log(`🚀 Database Core Engine: MongoDB (Mongoose ODM Layer)`);
      console.log(`🚀 Environment Matrix Level set to: ${process.env.NODE_ENV || 'development'}`);
      console.log(`===================================================`);
    });

  } catch (criticalFailure) {
    console.error('🛑 System boot pipeline halted due to critical engine initialization error:', criticalFailure);
    process.exit(1);
  }
}

bootSystemCluster();