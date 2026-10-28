// server/app.js
// Main entry point for the Online Exam Portal Express Server

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { initializeDatabase, isConnectedToMySQL, getDbConfig } from './db.js';
import authRoutes from './routes/authRoutes.js';
import examRoutes from './routes/examRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { recordViolation, submitExam, getAttemptResult } from './controllers/examController.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Direct attempt routes (as explicitly listed in problem statement: POST /api/attempts/:id/violation)
app.post('/api/attempts/:id/violation', authenticate, recordViolation);
app.post('/api/attempts/:id/submit', authenticate, submitExam);
app.get('/api/attempts/:id/result', authenticate, getAttemptResult);

// Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'Online Exam Portal API',
    database: {
      type: isConnectedToMySQL() ? 'MySQL (Live Connection Pool)' : 'Embedded Relational SQL Engine',
      connected: true,
      config: {
        host: getDbConfig().host,
        port: getDbConfig().port,
        database: getDbConfig().database,
        user: getDbConfig().user
      }
    }
  });
});

// Serve static frontend assets from /public directory
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Root route redirects to login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

// Start the server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 Online Exam Portal Server running at http://localhost:${PORT}`);
    console.log(`📊 Health Status: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Login Page:   http://localhost:${PORT}/login.html`);
    console.log(`🎓 Student Dash: http://localhost:${PORT}/dashboard.html`);
    console.log(`🛡️ Admin Portal:  http://localhost:${PORT}/admin.html`);
    console.log(`💾 Database:     ${isConnectedToMySQL() ? 'MySQL 8.0 (Live Pool)' : 'Built-in Relational Store'}`);
    console.log(`=======================================================`);
  });
}

// Only start listening if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}

export { app, startServer };
export default app;
