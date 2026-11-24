import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { seedData } from './utils/seeder.js';
import Item from './models/Item.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or server
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded local images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CampusKhoj Backend API (IIIT Allahabad)',
  });
});

// Seed trigger endpoint (useful for demo & resets)
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedData();
    res.status(200).json({
      success: true,
      message: 'CampusKhoj sample data seeded successfully!',
    });
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database has no items so application is immediately ready
    const count = await Item.countDocuments();
    if (count === 0) {
      console.log('📦 Empty database detected. Populating with initial IIITA campus items...');
      await seedData();
    }

    app.listen(PORT, () => {
      console.log(`🚀 CampusKhoj API Server running on port ${PORT}`);
      console.log(`📍 Endpoint: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
