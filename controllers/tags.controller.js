import { logger } from "../utils/winston.utils.js";
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} from "../services/tags.service.js";

const createTagController = async (req, res) => {
  logger.info("TagController - createTagController");
  try {
    const userId = res.locals.user.id;
    const tagData = req.body;
    const tag = await createTag( userId, tagData );
    logger.info("Tag created successfully");
    res.status(201).json(tag);
  } catch (error) {
    logger.error("Error creating tag");
    res.status(400).json({ message: error.message });
  }
};

const getTagsController = async (req, res) => {
  logger.info("TagController - getTagsController");
  try {
    const userId = res.locals.user.id;
    const start = parseInt(req?.query?.start, 10) || 0;
    const limit = parseInt(req?.query?.limit, 10) || Number.MAX_SAFE_INTEGER;
    const order = JSON.parse(req?.query?.order || '{"createdAt": -1}');
    const filter = JSON.parse(req?.query?.filter || "{}");

    const tags = await getTags(userId, start, limit, order, filter);

    logger.info("Fetched all tags");
    res.json(tags);
  } catch (error) {
    logger.error("Error fetching tags");
    res.status(500).json({ message: error.message });
  }
};

const updateTagController = async (req, res) => {
  logger.info("TagController - updateTagController");
  try {
    const userId = res.locals.user.id;
    const tag = await updateTag(userId, req.params.id, req.body);
    logger.info("Tag updated successfully");
    res.json(tag);
  } catch (error) {
    logger.error("Error updating tag");
    res.status(400).json({ message: error.message });
  }
};

const deleteTagController = async (req, res) => {
  logger.info("TagController - deleteTagController");
  try {
    const userId = res.locals.user.id;
    await deleteTag(userId, req.params.id);
    logger.info("Tag deleted successfully");
    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    logger.error("Error deleting tag");
    res.status(400).json({ message: error.message });
  }
};

export {
  createTagController,
  getTagsController,
  updateTagController,
  deleteTagController,
};
