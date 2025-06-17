const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5500', // Your frontend port
  credentials: true
}));


const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware to parse JSON
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // ✅ Correct place (after middleware)

// Test Route
app.get('/', (req, res) => {
  res.send('Hello JWT Playground!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

