const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


const app = express();
dotenv.config();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // allow both
  methods: '*', // allows all methods
  credentials: true
}));



const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware to parse JSON
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); 

// Test Route
app.get('/', (req, res) => {
  res.send('Hello JWT Playground!');
});

//It tells the OS where to send incoming HTTP traffic
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

