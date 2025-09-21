// src/app.js
const express = require('express');
const cors = require('cors');
const swagger = require('./api/swagger');
const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')
const doctorRoutes = require('./routes/doctorRoute')
const specialtyRoutes = require('./routes/specialtyRoute');
const scheduleRoutes = require('./routes/scheduleRoute');
const bookingRoutes = require('./routes/bookingRoute');
const allcodeRoutes = require('./routes/allcodeRoute');
const path = require('path');

const app = express();

// Dynamic CORS configuration for different environments
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:3000',     // Local development
    'https://a2t.io.vn',         // Production domain with SSL
    'http://a2t.io.vn',          // Production domain without SSL (fallback)
    'http://35.241.100.111',     // Server IP (fallback)
    'https://35.241.100.111'     // Server IP with SSL (fallback)
  ];

  // Add Docker/production origins
 

  // Add any additional origins from environment variable
  if (process.env.ALLOWED_ORIGINS) {
    origins.push(...process.env.ALLOWED_ORIGINS.split(','));
  }

  return origins;
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
  optionsSuccessStatus: 200
}
// Middleware
app.use(cors(corsOptions));
app.use(express.json());
// Cho phép truy cập ảnh tĩnh trong uploads/avatars
app.use('/uploads/avatars', express.static(path.join(__dirname, '../uploads/avatars')));

// Swagger Documentation
app.use('/api/docs', swagger.serve, swagger.setup);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/specialties', specialtyRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/allcode', allcodeRoutes);
module.exports = app;