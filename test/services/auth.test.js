import { jest } from "@jest/globals";
import { registerUser, loginUser } from "../../services/auth.service.js";
import User from "../../models/user.model.js";
import mongoose from "mongoose";
import { describe } from "node:test";
import '../setup.js';

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock-token")
}));

jest.mock("../../utils/winston.utils.js", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const generateUniqueMockData = (suffix = '') => ({
  username: `testing123${suffix}${Date.now()}`,
  email: `testing123${suffix}${Date.now()}@gmail.com`,
  password: "password123",
  userRole: "user",
  currency: "USD",
});

describe("Auth Service Tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("registerUser", () => {
    it("should create a new user", async () => {
      const mockUserData = generateUniqueMockData();
      const user = await registerUser(mockUserData);
      expect(user).toBeDefined();
      expect(user.toObject()).toEqual(
        expect.objectContaining({
          username: mockUserData.username,
          email: mockUserData.email,
          userRole: mockUserData.userRole,
          currency: mockUserData.currency,
        })
      );
    });
  });

  describe("loginUser", () => {
    let mockData;
    
    beforeEach(async () => {
      mockData = generateUniqueMockData('login');
      await User.create({
        _id: new mongoose.Types.ObjectId(),
        ...mockData
      });
    });

    it("should login an existing user", async () => {
      const user = await loginUser(mockData.email, mockData.password);
      expect(user).toBeDefined();
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("token");
    });

    it("should throw error for invalid credentials", async () => {
      await expect(loginUser(" ", " ")).rejects.toThrow("Invalid credentials");
    });
  });
});
