import { Router } from 'express';
import { z } from 'zod';
import { env } from '../lib/env.js';
import { createSession, destroySession, getCookieName, getSession } from '../lib/session.js';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post('/login', (request, response) => {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ message: 'Invalid login payload.' });
    return;
  }

  if (
    parsed.data.username !== env.adminUsername ||
    parsed.data.password !== env.adminPassword
  ) {
    response.status(401).json({ message: 'Incorrect username or password.' });
    return;
  }

  const { token, session } = createSession(parsed.data.username);

  response.cookie(getCookieName(), token, {
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  response.json(session);
});

router.post('/logout', (request, response) => {
  const token = request.signedCookies?.[getCookieName()];
  if (token) {
    destroySession(token);
  }

  response.clearCookie(getCookieName());
  response.json({ success: true });
});

router.get('/session', (request, response) => {
  const token = request.signedCookies?.[getCookieName()];
  const session = getSession(token);

  if (!session) {
    response.status(401).json({ message: 'Not authenticated.' });
    return;
  }

  response.json(session);
});

export { router as authRouter };
