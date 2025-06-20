import { JwtPayload } from '@/middleware/auth';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
  interface Multer {
    File: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination?: string;
      filename?: string;
      path?: string;
      buffer?: Buffer;
      public_id?: string; // Cloudinary specific
    };
  }
}

export {};
