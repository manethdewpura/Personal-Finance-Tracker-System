import { jest } from '@jest/globals';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../../services/categories.service.js';
import Category from '../../models/categories.model.js';
import mongoose from 'mongoose';

// Mock the logger
jest.mock('../../utils/winston.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Category Service Tests', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  const mockCategoryData = {
    category: 'Test Category Type',
    description: 'Test Description'
  };

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const category = await createCategory(mockCategoryData);
      expect(category).toBeDefined();
      expect(category.toObject()).toEqual(
        expect.objectContaining({
          category: mockCategoryData.category,
          description: mockCategoryData.description
        })
      );
    });
  });

  describe('getCategories', () => {
    beforeEach(async () => {
      await Category.create(mockCategoryData);
      await Category.create({ 
        category: 'Second Category Type',
        description: 'Second Description'
      });
    });

    it('should get all categories', async () => {
      const categories = await getCategories();
      expect(categories).toHaveLength(2);
      expect(categories[0]).toHaveProperty('category');
      expect(categories[0]).toHaveProperty('description');
    });
  });

  describe('updateCategory', () => {
    let categoryId;

    beforeEach(async () => {
      const category = await Category.create(mockCategoryData);
      categoryId = category._id;
    });

    it('should update an existing category', async () => {
      const updatedData = { 
        category: 'Updated Category Type',
        description: 'Updated Description'
      };
      const updated = await updateCategory(categoryId, updatedData);
      expect(updated).toBeDefined();
      expect(updated.toObject()).toEqual(
        expect.objectContaining(updatedData)
      );
    });

    it('should handle non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updated = await updateCategory(fakeId, {});
      expect(updated).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    let categoryId;

    beforeEach(async () => {
      const category = await Category.create(mockCategoryData);
      categoryId = category._id;
    });

    it('should delete an existing category', async () => {
      const result = await deleteCategory(categoryId);
      expect(result).toBe(true);
      const category = await Category.findById(categoryId);
      expect(category).toBeNull();
    });

    it('should handle deleting non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const result = await deleteCategory(fakeId);
      expect(result).toBe(true);
    });
  });
});
