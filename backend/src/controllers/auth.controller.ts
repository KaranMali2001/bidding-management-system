import { prisma } from '@/config/prisma';
import { loginSchema, registerSchema } from '@/types/auth';
import { signToken } from '@/utils/jwt';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { z } from 'zod';

type RegisterBody = z.infer<typeof registerSchema>;
type LoginBody = z.infer<typeof loginSchema>;

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body as RegisterBody;

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing)
      return res.status(409).json({ message: 'Email already taken' });

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        role: data.role,
      },
    });

    const token = signToken({ userId: user.id, role: user.role });

    return res.status(201).json({ token, user });
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = req.body as LoginBody;

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ userId: user.id, role: user.role });

    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        projects: true,
        bids: true,
      },
    });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}
