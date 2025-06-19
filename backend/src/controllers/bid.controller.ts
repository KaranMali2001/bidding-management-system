import { prisma } from '@/config/prisma';
import { Request, Response } from 'express';
import { z } from 'zod';
import { JwtPayload } from '@/middleware/auth';
import { bidSchema } from '@/types/bid';

type BidBody = z.infer<typeof bidSchema>;

export const createBid = async (req: Request, res: Response) => {
  try {
    const seller = req.user! as JwtPayload;
    const data = req.body as BidBody;

    const bid = await prisma.bid.create({
      data: {
        ...data,
        sellerId: seller.userId,
      },
    });
    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBidsForProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const bids = await prisma.bid.findMany({ where: { projectId } });
  res.json(bids);
};

export const getSellerBids = async (req: Request, res: Response) => {
  const seller = req.user! as JwtPayload;
  const bids = await prisma.bid.findMany({
    where: { sellerId: seller.userId },
  });
  res.json(bids);
};
