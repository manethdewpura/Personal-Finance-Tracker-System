import {getaAllUsers, updateUserRole, deleteUser} from '../services/user.service.js';
import { logger } from '../utils/winston.utils.js';

const getAllUsersController = async (req, res) => {
    logger.info('adminController - getAllUsersController');
    try {
        const users = await getaAllUsers();
        logger.info('Fetched all users');
        res.json(users);
    } catch (error) {
        logger.error('Error fetching users');
        res.status(500).json({ message: error.message });
    }
}

const updateRoleController = async (req, res) => {
    logger.info('adminController - updateRoleController');
    try {
        await updateUserRole(req.body);
        logger.info('User role updated successfully');
        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        logger.error('Error updating user role');
        res.status(400).json({ message: error.message });
    }
}

const removeUserController = async (req, res) => {
    logger.info('adminController - removeUserController');
    try {
        await deleteUser(req.params.userId);
        logger.info('User deleted successfully');
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error deleting user');
        res.status(400).json({ message: error.message });
    }
}

module.exports = { getAllUsersController, updateRoleController, removeUserController };