// Test environment setup
process.env.NODE_ENV = 'test';
process.env.DB_NAME = process.env.DB_NAME || 'test_db';
process.env.DB_USERNAME = process.env.DB_USERNAME || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'root';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '3306';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

// Global test timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific log levels
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
global.testUtils = {
  createMockUser: () => ({
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  createMockAppointment: () => ({
    id: 1,
    patientId: 1,
    doctorId: 1,
    date: new Date(),
    time: '10:00',
    status: 'scheduled',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

// Database cleanup helper
global.cleanupDatabase = async (sequelize) => {
  if (sequelize) {
    await sequelize.sync({ force: true });
  }
};
