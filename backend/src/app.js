// src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')

const specialtyRoutes = require('./routes/specialtyRoute');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Thay thế bằng origin của frontend
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/specialties', specialtyRoutes);
module.exports = app;