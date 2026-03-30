import path from 'node:path';
import { existsSync } from 'node:fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import { ZodError } from 'zod';
import { env } from './lib/env.js';
import { paths } from './lib/storage.js';
import { authRouter } from './routes/auth.js';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.sessionSecret));

app.use('/uploads', express.static(paths.uploads));
app.use('/api/auth', authRouter);
app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);

if (existsSync(paths.dist)) {
  app.use(express.static(paths.dist));

  app.get(/.*/, (request, response, next) => {
    if (request.path.startsWith('/api') || request.path.startsWith('/uploads')) {
      next();
      return;
    }

    response.sendFile(path.join(paths.dist, 'index.html'));
  });
}

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Validation failed.',
      issues: error.issues,
    });
    return;
  }

  if (error instanceof Error) {
    response.status(500).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(env.port, () => {
  console.log(`Portfolio API listening on http://localhost:${env.port}`);
});
