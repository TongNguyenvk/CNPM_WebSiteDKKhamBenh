const request = require('supertest');

// Mock Express app (adjust based on your actual app structure)
const express = require('express');
const app = express();

app.use(express.json());

// Mock auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (email === 'existing@example.com') {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: 1,
      email,
      name,
      role: 'patient',
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  if (email === 'test@example.com' && password === 'password123') {
    return res.status(200).json({
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'patient',
      },
    });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  if (token === 'mock-jwt-token') {
    return res.status(200).json({
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'patient',
      },
    });
  }
  
  res.status(401).json({ error: 'Invalid token' });
});

describe('Auth API Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.role).toBe('patient');
    });

    it('should return error for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.error).toBe('All fields are required');
    });

    it('should return error for existing email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.token).toBe('mock-jwt-token');
      expect(response.body.user.email).toBe(credentials.email);
    });

    it('should return error for invalid credentials', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return error for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.error).toBe('Email and password are required');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer mock-jwt-token')
        .expect(200);

      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.name).toBe('Test User');
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.error).toBe('No token provided');
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error).toBe('Invalid token');
    });
  });
});
