import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';

import userRoutes from './routes/user.route.js';

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --------- GLOBAL MIDDLEWARES ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------- HEALTH CHECK ----------
app.get('/', (req, res) => {
  res.send('🚀 B2B IndiaMART Clone API is running');
});

// --------- API ROUTES ----------
app.use('/api/v1/users', userRoutes);

// --------- DATABASE CONNECTION ----------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // --------- START SERVER ----------
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
