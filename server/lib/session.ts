import type { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import type { AdminSession } from '../../src/shared/lib/content-schema.js';

const COOKIE_NAME = 'schipor_admin';
const sessions = new Map<string, AdminSession>();

export function createSession(username: string) {
  const token = nanoid(32);
  const session = {
    username,
    authenticatedAt: new Date().toISOString(),
  };

  sessions.set(token, session);
  return { token, session };
}

export function destroySession(token: string) {
  sessions.delete(token);
}

export function getSession(token: string | undefined) {
  if (!token) {
    return null;
  }

  return sessions.get(token) ?? null;
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const token = request.signedCookies?.[COOKIE_NAME];
  const session = getSession(token);

  if (!session) {
    response.status(401).json({ message: 'Authentication required.' });
    return;
  }

  request.adminSession = session;
  next();
}
