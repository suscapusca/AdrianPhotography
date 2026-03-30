import { Router } from 'express';
import { getCategories, getPortfolio, getSite } from '../lib/storage.js';

const router = Router();

router.get('/site', async (_request, response, next) => {
  try {
    response.json(await getSite());
  } catch (error) {
    next(error);
  }
});

router.get('/portfolio', async (_request, response, next) => {
  try {
    const items = await getPortfolio();
    response.json(items.filter((item) => item.published));
  } catch (error) {
    next(error);
  }
});

router.get('/categories', async (_request, response, next) => {
  try {
    const items = await getCategories();
    response.json(items.filter((item) => item.visible));
  } catch (error) {
    next(error);
  }
});

export { router as publicRouter };
