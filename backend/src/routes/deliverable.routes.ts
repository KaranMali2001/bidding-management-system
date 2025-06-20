import { uploadDeliverable } from '@/controllers/deliverable.controller';
import { authenticate } from '@/middleware/auth';
import { upload } from '@/middleware/upload';
import { Router } from 'express';

const router = Router();

router.post(
  '/:projectId',
  authenticate('SELLER'),
  upload.single('file'),
  uploadDeliverable,
);

export default router;
