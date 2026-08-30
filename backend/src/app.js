const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());

// API Prefix
const API_PREFIX = '/api/v1';

// Root API Endpoint
app.get(API_PREFIX, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the SIH Railway Demo API',
    endpoints: {
      health: `${API_PREFIX}/health`,
      dashboard: `${API_PREFIX}/dashboard/summary`
    }
  });
});

// Health Check Endpoint
app.get(`${API_PREFIX}/health`, (req, res) => {
  // We'll check the mongoose connection state here
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      database: dbStatus
    }
  });
});

// Mount Routes here
const routeRoutes = require('./routes/route.routes');
const sectionRoutes = require('./routes/section.routes');
const trainRoutes = require('./routes/train.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const passengerRoutes = require('./routes/passenger.routes');

app.use(`${API_PREFIX}/routes`, routeRoutes);
app.use(`${API_PREFIX}/sections`, sectionRoutes);
app.use(`${API_PREFIX}/trains`, trainRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/passenger`, passengerRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
