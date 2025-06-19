import { prisma } from '@/config/prisma';
import { JwtPayload } from '@/middleware/auth';
import { projectSchema } from '@/types/project';
import { sendEmail } from '@/utils/email';
import { Request, Response } from 'express';
import { z } from 'zod';

type ProjectBody = z.infer<typeof projectSchema>;

export const createProject = async (req: Request, res: Response) => {
  try {
    const buyer = req.user! as JwtPayload;
    const data = req.body as ProjectBody;

    const project = await prisma.project.create({
      data: {
        ...data,
        deadline: new Date(data.deadline),
        status: 'Pending',
        buyerId: buyer.userId,
      },
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBuyerProjects = async (req: Request, res: Response) => {
  const buyer = req.user! as JwtPayload;
  const projects = await prisma.project.findMany({
    where: { buyerId: buyer.userId },
  });
  res.json(projects);
};

export const getOpenProjects = async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    where: { status: 'Pending' },
  });
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      bids: true,
    },
  });

  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
};

export const updateProjectStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as {
    status: 'Pending' | 'InProgress' | 'Completed';
  };
  const project = await prisma.project.update({
    where: { id },
    data: { status },
  });
  res.json(project);
};

export const markProjectComplete = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await prisma.project.update({
    where: { id },
    data: { status: 'Completed' },
  });
  // notify buyer & seller
  sendEmail(project);
  res.json(project);
};

export const selectSeller = async (req: Request, res: Response) => {
  const { id, bidId } = req.params;

  const updated = await prisma.project.update({
    where: { id },
    data: {
      selectedBidId: bidId,
      status: 'InProgress',
    },
  });

  // notify seller
  sendEmail(updated);
  res.json(updated);
};
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await prisma.project.delete({
    where: {
      id: id,
      buyerId: req.user.userId,
    },
  });
  res.json(project);
};
