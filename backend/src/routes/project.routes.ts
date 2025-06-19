import {
  createProject,
  getBuyerProjects,
  getOpenProjects,
  getProjectById,
  markProjectComplete,
  selectSeller,
  updateProject,
  updateProjectStatus,
} from '@/controllers/project.controller';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';
import { projectSchema } from '@/types/project';
import { Router } from 'express';

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
router.put('/:id', authenticate('BUYER'), updateProject);
router.patch('/:id/status', authenticate('BUYER'), updateProjectStatus);
router.patch('/:id/complete', authenticate('BUYER'), markProjectComplete);
router.post('/:id/select/:bidId', authenticate('BUYER'), selectSeller);

export default router;
