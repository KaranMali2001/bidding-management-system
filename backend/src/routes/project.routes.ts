import { Router } from 'express';
import { validateRequest } from '@/middleware/validateRequest';
import { projectSchema } from '@/types/project';
import {
  createProject,
  getBuyerProjects,
  getOpenProjects,
  getProjectById,
  updateProjectStatus,
  markProjectComplete,
  selectSeller,
} from '@/controllers/project.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.post(
  '/',
  authenticate('BUYER'),
  validateRequest(projectSchema),
  createProject,
);
router.get('/', authenticate('BUYER'), getBuyerProjects);
router.get('/open', getOpenProjects);
router.get('/:id', getProjectById);
router.patch('/:id/status', authenticate('BUYER'), updateProjectStatus);
router.patch('/:id/complete', authenticate('BUYER'), markProjectComplete);
router.post('/:id/select/:bidId', authenticate('BUYER'), selectSeller);

export default router;
