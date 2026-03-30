import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const privateIpv4Pattern =
  /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/;
const preferredInterfaceNames = ['en0', 'en1'];

function getLanHost() {
  const interfaces = networkInterfaces();
  const forcedHost = process.env.VITE_HMR_HOST?.trim();

  if (forcedHost) {
    return forcedHost;
  }

  for (const interfaceName of preferredInterfaceNames) {
    for (const entry of interfaces[interfaceName] ?? []) {
      if (
        entry.family === 'IPv4' &&
        !entry.internal &&
        privateIpv4Pattern.test(entry.address)
      ) {
        return entry.address;
      }
    }
  }

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries ?? []) {
      if (
        entry.family === 'IPv4' &&
        !entry.internal &&
        privateIpv4Pattern.test(entry.address)
      ) {
        return entry.address;
      }
    }
  }

  return 'localhost';
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 120,
    },
    hmr: {
      host: getLanHost(),
      clientPort: 5173,
      protocol: 'ws',
    },
    proxy: {
      '/api': 'http://localhost:4174',
      '/uploads': 'http://localhost:4174',
    },
  },
});
