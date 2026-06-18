import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5099;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/students_db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Student Management System API is running.');
});

// Database connection & Server Startup
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    console.warn('⚠️ WARNING: Make sure MongoDB is installed and running locally, or configure a valid MONGO_URI in a .env file.');

    // Fallback: Start the server anyway so the frontend can receive error responses rather than connection failures
    app.listen(PORT, () => {
      console.log(`Server running in fallback mode on port ${PORT} (Database disconnected)`);
    });
  });
