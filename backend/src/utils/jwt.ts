import jwt from 'jsonwebtoken';
import { JwtPayload } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = '7d';

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};
