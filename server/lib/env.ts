export const env = {
  port: Number(process.env.PORT ?? 4174),
  adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'change-me',
  sessionSecret: process.env.SESSION_SECRET ?? 'schipor-adrian-demo-secret',
};
