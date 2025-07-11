import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock API functions (adjust based on your actual API)
const fetchUserProfile = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
};

const loginUser = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

// Mock server setup
const server = setupServer(
  rest.get('/api/users/:userId', (req, res, ctx) => {
    const { userId } = req.params;
    return res(
      ctx.json({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
      })
    );
  }),

  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.json({
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
          },
        })
      );
    }
    
    return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Integration Tests', () => {
  describe('fetchUserProfile', () => {
    it('fetches user profile successfully', async () => {
      const user = await fetchUserProfile('123');
      
      expect(user).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });

  describe('loginUser', () => {
    it('logs in user successfully with valid credentials', async () => {
      const result = await loginUser('test@example.com', 'password123');
      
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
    });

    it('throws error with invalid credentials', async () => {
      await expect(
        loginUser('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('Login failed');
    });
  });
});
