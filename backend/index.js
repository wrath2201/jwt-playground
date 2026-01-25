const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser=require('cookie-parser');
const { connectRedis } = require('./utils/redisClient');


dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: '*',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello JWT Playground!');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    console.log('⏳ Connecting to Redis...');
    await connectRedis();
    

    app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});

  } catch (err) {
    console.error('❌ Startup failure:', err);
    process.exit(1);
  }
};

startServer();

const mongoose = require('mongoose');
const { disconnectRedis } = require('./utils/redisClient');

const gracefulShutdown = async () => {
  console.log('🛑 Shutting down gracefully...');
  await mongoose.disconnect();
  await disconnectRedis();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);


