import { jest } from '@jest/globals';
import { createTag, getTags, updateTag, deleteTag } from '../../services/tags.service.js';
import Tag from '../../models/tags.model.js';
import mongoose from 'mongoose';

// Mock the logger
jest.mock('../../utils/winston.utils.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Tag Service Tests', () => {
  const mockUserId = new mongoose.Types.ObjectId();
  const mockTagData = {
    tag: 'Test Tag'
  };

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const tag = await createTag(mockUserId, mockTagData);
      expect(tag.user).toEqual(mockUserId);
      expect(tag.tag).toBe(mockTagData.tag);
    });
  });

  describe('getTags', () => {
    beforeEach(async () => {
      await Tag.create({ ...mockTagData, user: mockUserId });
      await Tag.create({ ...mockTagData, tag: 'Second Tag', user: mockUserId });
    });

    it('should get all tags for a user', async () => {
      const tags = await getTags(mockUserId, 0, 10, { createdAt: -1 }, {});
      expect(tags).toHaveLength(2);
      expect(tags[0].user).toEqual(mockUserId);
    });
  });

  describe('updateTag', () => {
    let tagId;

    beforeEach(async () => {
      const tag = await Tag.create({ ...mockTagData, user: mockUserId });
      tagId = tag._id;
    });

    it('should update an existing tag', async () => {
      const updatedData = { tag: 'Updated Tag' };
      const updated = await updateTag(mockUserId, tagId, updatedData);
      expect(updated.tag).toBe('Updated Tag');
    });

    it('should throw error for non-existent tag', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(updateTag(mockUserId, fakeId, {}))
        .rejects
        .toThrow('Tag not found or user not authorized');
    });
  });

  describe('deleteTag', () => {
    let tagId;

    beforeEach(async () => {
      const tag = await Tag.create({ ...mockTagData, user: mockUserId });
      tagId = tag._id;
    });

    it('should delete an existing tag', async () => {
      const result = await deleteTag(mockUserId, tagId);
      expect(result).toBe(true);
      const tag = await Tag.findById(tagId);
      expect(tag).toBeNull();
    });

    it('should throw error for non-existent tag', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(deleteTag(mockUserId, fakeId))
        .rejects
        .toThrow('Tag not found or user not authorized');
    });
  });

  // Add cleanup after each test
  afterEach(async () => {
    await Tag.deleteMany({});
  });
});
