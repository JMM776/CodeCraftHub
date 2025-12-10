const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/user.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Middleware setup
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Error handling middleware (should be last)
app.use(errorMiddleware);

module.exports = app;
