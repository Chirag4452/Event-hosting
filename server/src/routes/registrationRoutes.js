// Import required modules
import express from 'express';
import { registerUser, getAllRegistrations } from '../controllers/registrationController.js';
import { validateSchema } from '../middleware/validation.js';
import { registrationSchema } from '../schemas/userSchemas.js';
import { registrationRateLimit } from '../middleware/rateLimiter.js';

// Create router instance
const router = express.Router();

// Define routes
// POST /register - Register a new user (no middleware for debugging)
router.post('/register', registerUser);

// GET /registrations - Get all registrations (admin)
router.get('/registrations', getAllRegistrations);

// Export the router
export default router;
