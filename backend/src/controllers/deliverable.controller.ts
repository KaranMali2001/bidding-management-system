import { prisma } from '@/config/prisma';
import { JwtPayload } from '@/middleware/auth';
import { Request, Response } from 'express';
import { z } from 'zod';
import { deliverableSchema } from '@/types/deliverable';

type DeliverableBody = z.infer<typeof deliverableSchema>;

export const uploadDeliverable = async (req: Request, res: Response) => {
  try {
    const seller = req.user! as JwtPayload;
    const { projectId } = req.params;
    const data = req.body as DeliverableBody;

    // verify that seller is selected for project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.selectedBidId == null)
      return res.status(400).json({ message: 'Project not in progress' });

    const bid = await prisma.bid.findUnique({
      where: { id: project.selectedBidId },
    });
    if (!bid || bid.sellerId !== seller.userId)
      return res.status(403).json({ message: 'Not your project' });

    const deliverable = await prisma.deliverable.create({
      data: { projectId, fileUrl: data.fileUrl },
    });
    res.status(201).json(deliverable);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
