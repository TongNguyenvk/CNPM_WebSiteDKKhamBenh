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

const corsOptions = {
  origin: 'http://localhost:3000', // Thay thế bằng origin của frontend
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// Middleware
app.use(cors(corsOptions));
app.use(express.json());
// Cho phép truy cập ảnh tĩnh trong uploads/avatars
app.use('/uploads/avatars', express.static(path.join(__dirname, '../uploads/avatars')));

// Swagger Documentation
app.use('/api-docs', swagger.serve, swagger.setup);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/specialties', specialtyRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/allcode', allcodeRoutes);
module.exports = app;