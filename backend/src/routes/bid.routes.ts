import { Router } from 'express';
import {
  createBid,
  getBidsForProject,
  getSellerBids,
} from '@/controllers/bid.controller';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';
import { bidSchema } from '@/types/bid';

const router = Router();

router.post('/', authenticate('SELLER'), validateRequest(bidSchema), createBid);
router.get('/project/:projectId', getBidsForProject);
router.get('/mine', authenticate('SELLER'), getSellerBids);

export default router;
