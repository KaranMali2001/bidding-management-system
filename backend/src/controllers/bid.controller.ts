import { prisma } from '@/config/prisma';
import { JwtPayload } from '@/middleware/auth';
import { bidSchema } from '@/types/bid';
import { Request, Response } from 'express';
import { z } from 'zod';

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
      include: {
        seller: true,
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
    include: {
      project: true,
    },
  });
  res.json(bids);
};
export const updateBid = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, amount, estimatedTime } = req.body;
  try {
    const bid = await prisma.bid.update({
      where: { id, sellerId: req.user.userId },
      data: {
        message,
        amount,
        estimatedTime,
      },
    });
    res.status(200).json(bid);
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ message: 'Error updating bid' });
  }
};
export async function withdrawBid(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const bid = await prisma.bid.delete({
      where: {
        id: id,
        sellerId: req.user.userId,
      },
    });
    res.status(200).json(bid);
  } catch (error) {
    console.error('Error withdrawing bid:', error);
    res.status(500).json({ message: 'Error withdrawing bid' });
  }
}
