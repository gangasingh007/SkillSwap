import { Router } from 'express';
import { getMe, updateMe, getUserById } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.get('/:id', getUserById);

export default router;
