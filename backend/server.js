require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Base route ko thoda badal do
app.get('/', (req, res) => {
  res.send('Bhai, ye mera he code chal rha hai! Verification success.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/status', statusRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Datastraw CRM API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});