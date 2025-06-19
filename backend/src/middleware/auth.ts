import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  role: 'BUYER' | 'SELLER';
}

export const authenticate = (...allowedRoles: ('BUYER' | 'SELLER')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({ message: 'Unauthenticated' });
        return;
      }

      const secret = process.env.JWT_SECRET as string;
      const payload = jwt.verify(token, secret) as JwtPayload;

      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      (req as any).user = payload;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
  };
};
