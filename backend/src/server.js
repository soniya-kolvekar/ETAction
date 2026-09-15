const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

if (!process.env.VERCEL) {
  // Start Server
  const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

module.exports = app;
