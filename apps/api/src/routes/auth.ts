import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../utils/validators';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;

