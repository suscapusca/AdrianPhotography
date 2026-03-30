import type { AdminSession } from '../../src/shared/lib/content-schema.js';

declare global {
  namespace Express {
    interface Request {
      adminSession?: AdminSession;
    }
  }
}

export {};
