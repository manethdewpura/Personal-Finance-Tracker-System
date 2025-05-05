import {registerUser, loginUser} from '../services/auth.service.js';
import { logger } from "../utils/winston.utils.js";


const registerController = async (req, res) => {
    logger.info("AuthController - registerController");
    try {
        const { username, email, password } = req.body;
        const token = await registerUser({ username, email, password });

        logger.info("User registered successfully");
        res.status(201).json({ token });
    } catch (error) {
        logger.error("Error registering user");
        res.status(400).json({ message: error.message });
    }
}

const loginController = async (req, res) => {
    logger.info("AuthController - loginController");
    try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);

        logger.info("User logged in successfully");
        res.status(200).json(token);
    } catch (error) {
        logger.error("Error logging in user");
        res.status(401).json({ message: error.message });
    }
}

export { registerController, loginController };