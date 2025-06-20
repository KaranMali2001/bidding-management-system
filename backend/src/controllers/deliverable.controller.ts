import { prisma } from '@/config/prisma';
import { JwtPayload } from '@/middleware/auth';
import { Request, Response } from 'express';

export const uploadDeliverable = async (req: Request, res: Response) => {
  try {
    const seller = req.user! as JwtPayload;
    const { projectId } = req.params;
    const file = req.file;
    console.log('FILE', file);
    if (!file?.path) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Fetch and verify the project
      const project = await tx.project.findUnique({
        where: { id: projectId },
      });

      if (!project || project.selectedBidId == null) {
        throw new Error('Project not in progress');
      }

      const bid = await tx.bid.findUnique({
        where: { id: project.selectedBidId },
      });

      if (!bid || bid.sellerId !== seller.userId) {
        throw new Error('Not your project');
      }

      // Mark project and bid as completed
      await tx.project.update({
        where: { id: projectId },
        data: { status: 'COMPLETED' },
      });

      await tx.bid.update({
        where: { id: project.selectedBidId },
        data: { status: 'COMPLETED' },
      });

      // Create deliverable
      const deliverable = await tx.deliverable.create({
        data: {
          projectId,
          fileUrl: file.path,
        },
      });

      return deliverable;
    });

    res.status(201).json(result);
  } catch (err: any) {
    console.error('Error creating deliverable:', err);
    if (
      err.message === 'Project not in progress' ||
      err.message === 'Not your project'
    ) {
      console.log('err', err);
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
