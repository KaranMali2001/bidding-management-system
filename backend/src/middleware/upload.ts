import { cloudinaryClient } from '@/config/cloudinary';
import { Request } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryClient,
  params: async (req: Request, file: Express.Multer.File) => {
    const timestamp = Date.now();
    const originalName = file.originalname;
    return {
      folder: 'deliverables',

      resource_type: 'raw',
      public_id: `${req.params.projectId}_${originalName}_${timestamp}`,
    };
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-zip',
    ];

    const isZipFile =
      allowedMimeTypes.includes(file.mimetype) ||
      file.originalname.toLowerCase().endsWith('.zip');

    if (isZipFile) {
      cb(null, true);
    } else {
      const error = new Error('Only ZIP files are allowed') as any;
      error.code = 'INVALID_FILE_TYPE';
      cb(error, false);
    }
  },
});
