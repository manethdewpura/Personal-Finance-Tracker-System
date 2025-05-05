import { logger } from "../utils/winston.utils.js";
import ThrowError from "../utils/error.utils.js";
import Tag from "../models/tags.model.js";

const createTag = async (userId, tagData) => {
  logger.info("TagService - createTag");
  try {
    logger.info("Creating new tag");
    return await Tag.create({ user: userId, ...tagData });
  } catch (error) {
    logger.error("Error creating tag");
    throw ThrowError(error);
  }
};

const getTags = async (userId, start, limit, order, filter) => {
  logger.info("TagService - getTags");
  try {
    const tags = await Tag.find({ user: userId, ...filter })
      .sort(order)
      .skip(start)
      .limit(limit);

    logger.info("Fetched all tags");
    return tags;
  } catch (error) {
    logger.error("Error fetching tags");
    throw ThrowError(error);
  }
};

const updateTag = async (userId, id, tagData) => {
  logger.info(`TagService - updateTag`);
  try {
    logger.info(`Updating tag with ID: ${id}`);
    const tag = await Tag.findOneAndUpdate(
      { _id: id, user: userId },  // Changed userId to user
      tagData,
      { new: true }
    );
    if (!tag) {
      throw new Error("Tag not found or user not authorized");
    }
    return tag;
  } catch (error) {
    logger.error(`Error updating tag with ID: ${id}`);
    throw ThrowError(error);
  }
};

const deleteTag = async (userId, id) => {
  logger.info(`TagService - deleteTag`);
  try {
    logger.info(`Deleting tag with ID: ${id}`);
    const tag = await Tag.findOneAndDelete({ _id: id, user: userId }); // Changed userId to user
    if (!tag) {
      throw new Error("Tag not found or user not authorized");
    }
    return true;
  } catch (error) {
    logger.error(`Error deleting tag with ID: ${id}`);
    throw ThrowError(error);
  }
};

export { createTag, getTags, updateTag, deleteTag };
