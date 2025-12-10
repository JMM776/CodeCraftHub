require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db.config');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});