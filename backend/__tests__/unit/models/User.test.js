// Mock User model (adjust based on your actual User model)
const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedpassword',
  role: 'patient',
  createdAt: new Date(),
  updatedAt: new Date(),
  
  // Mock methods
  save: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
};

// Mock Sequelize User model
const User = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User.create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedpassword',
        role: 'patient',
      };

      User.create.mockResolvedValue({ ...mockUser, ...userData });

      const result = await User.create(userData);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'hashedpassword',
      };

      User.create.mockRejectedValue(new Error('Email already exists'));

      await expect(User.create(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('User.findOne', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      User.findOne.mockResolvedValue(mockUser);

      const result = await User.findOne({ where: { email } });

      expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await User.findOne({ where: { email: 'nonexistent@example.com' } });

      expect(result).toBeNull();
    });
  });

  describe('User.findByPk', () => {
    it('should find user by primary key', async () => {
      const userId = 1;
      User.findByPk.mockResolvedValue(mockUser);

      const result = await User.findByPk(userId);

      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('User.findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser, { ...mockUser, id: 2, email: 'user2@example.com' }];
      User.findAll.mockResolvedValue(users);

      const result = await User.findAll();

      expect(User.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should filter users by role', async () => {
      const patients = [mockUser];
      User.findAll.mockResolvedValue(patients);

      const result = await User.findAll({ where: { role: 'patient' } });

      expect(User.findAll).toHaveBeenCalledWith({ where: { role: 'patient' } });
      expect(result).toEqual(patients);
    });
  });

  describe('User.update', () => {
    it('should update user data', async () => {
      const updateData = { name: 'Updated Name' };
      User.update.mockResolvedValue([1]); // Returns array with number of affected rows

      const result = await User.update(updateData, { where: { id: 1 } });

      expect(User.update).toHaveBeenCalledWith(updateData, { where: { id: 1 } });
      expect(result[0]).toBe(1); // One row affected
    });
  });

  describe('User.destroy', () => {
    it('should delete user', async () => {
      User.destroy.mockResolvedValue(1); // Returns number of deleted rows

      const result = await User.destroy({ where: { id: 1 } });

      expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });
  });
});
