// Import required modules
import express from 'express';
import { registerUser, getAllRegistrations } from '../controllers/registrationController.js';
import { validateSchema } from '../middleware/validation.js';
import { userSchema } from '../schemas/userSchemas.js';
import { registrationRateLimit } from '../middleware/rateLimiter.js';

// Create router instance
const router = express.Router();

// Define routes
// POST /register - Register a new user (with validation and rate limiting)
router.post('/register', registrationRateLimit, validateSchema(userSchema), registerUser);

// GET /registrations - Get all registrations (admin)
router.get('/registrations', getAllRegistrations);

// Export the router
export default router;
