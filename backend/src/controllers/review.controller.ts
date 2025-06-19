import { prisma } from '@/config/prisma';
import { JwtPayload } from '@/middleware/auth';
import { Request, Response } from 'express';
import { z } from 'zod';
import { reviewSchema } from '@/types/review';

type ReviewBody = z.infer<typeof reviewSchema>;

export const submitReview = async (req: Request, res: Response) => {
  try {
    const buyer = req.user! as JwtPayload;
    const { projectId } = req.params;
    const data = req.body as ReviewBody;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (
      !project ||
      project.buyerId !== buyer.userId ||
      project.status !== 'Completed'
    )
      return res.status(400).json({ message: 'Invalid project' });

    const review = await prisma.review.create({
      data: {
        ...data,
        projectId,
      },
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSellerReviews = async (req: Request, res: Response) => {
  const { sellerId } = req.params;
  const reviews = await prisma.review.findMany({
    where: { project: { selectedBid: { sellerId } } },
    include: { project: true },
  });
  res.json(reviews);
};
