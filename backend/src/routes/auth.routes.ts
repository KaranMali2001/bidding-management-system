import { getCurrentUser, login, register } from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';
import { loginSchema, registerSchema } from '@/types/auth';
import { Router } from 'express';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/getCurrentUser', authenticate('BUYER', 'SELLER'), getCurrentUser);

export default router;
