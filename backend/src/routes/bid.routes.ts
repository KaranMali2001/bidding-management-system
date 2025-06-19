import {
  createBid,
  getBidsForProject,
  getSellerBids,
  updateBid,
  withdrawBid,
} from '@/controllers/bid.controller';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';
import { bidSchema } from '@/types/bid';
import { Router } from 'express';

const router = Router();

router.post('/', authenticate('SELLER'), validateRequest(bidSchema), createBid);
router.get('/project/:projectId', getBidsForProject);
router.get('/mine', authenticate('SELLER'), getSellerBids);
router.put(
  '/:id',
  authenticate('SELLER'),
  validateRequest(bidSchema),
  updateBid,
);
router.delete('/:id', authenticate('SELLER'), withdrawBid);
export default router;
