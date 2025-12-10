/*
 * Unit and Integration Testing Setup for User Management Service
 * Includes Jest config, sample tests, and supporting files
 */

// tests/unit/user.service.test.js
const mongoose = require('mongoose');
const User = require('../../src/models/user.model');
const userService = require('../../src/services/user.service');
const bcrypt = require('bcryptjs');

// Use in-memory MongoDB server for testing (optional but recommended)
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Service', () => {
  it('should create a user with hashed password', async () => {
    const userData = { email: 'test@example.com', password: 'Password123', name: 'Test User' };
    const user = await userService.createUser(userData);

    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.password).not.toBe(userData.password); // Password should be hashed

    const isMatch = await bcrypt.compare(userData.password, user.password);
    expect(isMatch).toBe(true);
  });

  it('should find a user by email', async () => {
    const userData = { email: 'findme@example.com', password: 'Password123', name: 'Find Me' };
    await userService.createUser(userData);

    const user = await userService.findUserByEmail(userData.email);
    expect(user).not.toBeNull();
    expect(user.email).toBe(userData.email);
  });

  it('should find a user by id excluding password', async () => {
    const userData = { email: 'idtest@example.com', password: 'Password123', name: 'ID Test' };
    const createdUser = await userService.createUser(userData);

    const user = await userService.findUserById(createdUser._id);
    expect(user).not.toBeNull();
    expect(user.email).toBe(userData.email);
    expect(user.password).toBeUndefined();
  });
});
