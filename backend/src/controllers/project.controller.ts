import { prisma } from '@/config/prisma';
import { JwtPayload } from '@/middleware/auth';
import { projectSchema } from '@/types/project';
import { sendEmail } from '@/utils/email';
import { Project } from '@prisma/client';
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
        status: 'PENDING',
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
  try {
    const projects = await prisma.project.findMany({
      where: { buyerId: buyer.userId },
      include: {
        bids: true,
      },
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching buyer projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

export const getOpenProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'PENDING' },
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching open projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        bids: {
          include: {
            seller: true,
          },
        },
      },
    });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
};

export const updateProjectStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { status, deadline, description, budgetMin, budgetMax, title } =
      req.body as Project;

    const project = await prisma.project.update({
      where: { id, buyerId: req.user.userId },
      data: { status, title, description, budgetMin, budgetMax, deadline },
    });
    res.json(project);
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Error updating project status' });
  }
};

export const markProjectComplete = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
    // notify buyer & seller
    sendEmail(project);
    res.json(project);
  } catch (error) {
    console.error('Error marking project complete:', error);
    res.status(500).json({ message: 'Error marking project complete' });
  }
};

export const selectSeller = async (req: Request, res: Response) => {
  const { id, bidId } = req.params;
  try {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        selectedBidId: bidId,
        status: 'IN_PROGRESS',
      },
      include: {
        bids: {
          include: {
            seller: true,
          },
        },
        selectedBid: true,
      },
    });
    await prisma.bid.update({
      where: {
        id: bidId,
      },
      data: {
        status: 'IN_PROGRESS',
      },
    });
    // notify seller
    // sendEmail(updated);
    res.json(updated);
  } catch (error) {
    console.error('Error selecting seller:', error);
    res.status(500).json({ message: 'Error selecting seller' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.delete({
      where: {
        id: id,
        buyerId: req.user.userId,
      },
    });
    res.json(project);
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { title, description, budgetMin, budgetMax, deadline, status } =
      req.body;

    // Build update data object with only provided fields
    const updateData: Partial<Project> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (budgetMin !== undefined) updateData.budgetMin = budgetMin;
    if (budgetMax !== undefined) updateData.budgetMax = budgetMax;
    if (deadline !== undefined) updateData.deadline = new Date(deadline);
    if (status !== undefined) updateData.status = status;

    // Only proceed if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    const project = await prisma.project.update({
      where: {
        id: id,
        buyerId: req.user.userId,
      },
      data: updateData,
    });

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};
