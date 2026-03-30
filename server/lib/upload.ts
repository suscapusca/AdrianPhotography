import path from 'node:path';
import { promises as fs } from 'node:fs';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { paths } from './storage.js';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const storage = multer.diskStorage({
  destination: async (_request, _file, callback) => {
    await fs.mkdir(paths.uploads, { recursive: true });
    callback(null, paths.uploads);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${nanoid(8)}${extension}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 40 * 1024 * 1024,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error('Unsupported file type.'));
      return;
    }
    callback(null, true);
  },
});
