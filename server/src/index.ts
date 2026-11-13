import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db';
import { seedDatabase } from './utils/seedData';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import dashboardRoutes from './routes/dashboard';
import moduleRoutes from './routes/modules';
import missionRoutes from './routes/missions';
import quizRoutes from './routes/quizzes';
import progressRoutes from './routes/progress';
import leaderboardRoutes from './routes/leaderboard';
import nasaRoutes from './routes/nasa';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/nasa', nasaRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'NOVA 2.O Junior Astronaut Mission Trainer Backend',
    timestamp: new Date().toISOString(),
  });
});

// Serve static frontend assets if built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`[NOVA 2.O Server] Serving production frontend build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[NOVA 2.O Server Error]:', err.stack || err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal mission control system error.',
  });
});

// Start Server and initialize Database
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 NOVA 2.O MISSION CONTROL RUNNING ON http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start Mission Control server:', error);
    process.exit(1);
  }
};

startServer();
