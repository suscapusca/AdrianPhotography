import path from 'node:path';
import { promises as fs } from 'node:fs';
import type { Category, PortfolioItem, SiteContent } from '../../src/shared/lib/content-schema.js';

const projectRoot = process.cwd();

export const paths = {
  projectRoot,
  site: path.join(projectRoot, 'storage/content/site.json'),
  portfolio: path.join(projectRoot, 'storage/content/portfolio.json'),
  categories: path.join(projectRoot, 'storage/content/categories.json'),
  uploads: path.join(projectRoot, 'storage/uploads'),
  dist: path.join(projectRoot, 'dist'),
};

async function readJsonFile<T>(filePath: string): Promise<T> {
  const file = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(file) as T;
}

async function writeJsonFile<T>(filePath: string, value: T) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
}

export async function getSite() {
  return readJsonFile<SiteContent>(paths.site);
}

export async function saveSite(value: SiteContent) {
  await writeJsonFile(paths.site, value);
  return value;
}

export async function getPortfolio() {
  const items = await readJsonFile<PortfolioItem[]>(paths.portfolio);
  return [...items].sort((left, right) => left.order - right.order);
}

export async function savePortfolio(value: PortfolioItem[]) {
  await writeJsonFile(paths.portfolio, value);
  return value;
}

export async function getCategories() {
  const items = await readJsonFile<Category[]>(paths.categories);
  return [...items].sort((left, right) => left.order - right.order);
}

export async function saveCategories(value: Category[]) {
  await writeJsonFile(paths.categories, value);
  return value;
}

export async function listUploads() {
  await fs.mkdir(paths.uploads, { recursive: true });
  const entries = await fs.readdir(paths.uploads, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const fullPath = path.join(paths.uploads, entry.name);
        const stats = await fs.stat(fullPath);
        return {
          filename: entry.name,
          url: `/uploads/${entry.name}`,
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
        };
      }),
  );

  return files.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
