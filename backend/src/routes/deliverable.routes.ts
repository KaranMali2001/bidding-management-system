import { Router } from 'express';
import { uploadDeliverable } from '@/controllers/deliverable.controller';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';
import { deliverableSchema } from '@/types/deliverable';

const router = Router();

router.post(
  '/:projectId',
  authenticate('SELLER'),
  validateRequest(deliverableSchema),
  uploadDeliverable,
);

export default router;
