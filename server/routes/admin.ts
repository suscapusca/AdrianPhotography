import { Router } from 'express';
import {
  CategoryInputSchema,
  CategorySchema,
  PortfolioItemInputSchema,
  PortfolioItemSchema,
  SiteContentSchema,
} from '../../src/shared/lib/content-schema.js';
import { slugify } from '../../src/shared/lib/text.js';
import { getCategories, getPortfolio, getSite, listUploads, saveCategories, savePortfolio, saveSite } from '../lib/storage.js';
import { upload } from '../lib/upload.js';
import { requireAdmin } from '../lib/session.js';

const router = Router();

router.use(requireAdmin);

router.get('/site', async (_request, response, next) => {
  try {
    response.json(await getSite());
  } catch (error) {
    next(error);
  }
});

router.put('/site', async (request, response, next) => {
  try {
    const parsed = SiteContentSchema.parse(request.body);
    response.json(await saveSite(parsed));
  } catch (error) {
    next(error);
  }
});

router.get('/portfolio', async (_request, response, next) => {
  try {
    response.json(await getPortfolio());
  } catch (error) {
    next(error);
  }
});

router.post('/portfolio', async (request, response, next) => {
  try {
    const parsed = PortfolioItemInputSchema.parse(request.body);
    const items = await getPortfolio();
    const item = PortfolioItemSchema.parse({
      ...parsed,
      id: parsed.id ?? `work-${slugify(parsed.title)}`,
      slug: parsed.slug ?? slugify(parsed.title),
    });

    if (items.some((entry) => entry.id === item.id)) {
      response.status(409).json({ message: 'A portfolio item with this id already exists.' });
      return;
    }

    items.push(item);
    response.status(201).json(await savePortfolio(items));
  } catch (error) {
    next(error);
  }
});

router.put('/portfolio/:id', async (request, response, next) => {
  try {
    const parsed = PortfolioItemInputSchema.parse(request.body);
    const items = await getPortfolio();
    const index = items.findIndex((item) => item.id === request.params.id);

    if (index === -1) {
      response.status(404).json({ message: 'Portfolio item not found.' });
      return;
    }

    items[index] = PortfolioItemSchema.parse({
      ...parsed,
      id: request.params.id,
      slug: parsed.slug ?? slugify(parsed.title),
    });

    response.json(await savePortfolio(items));
  } catch (error) {
    next(error);
  }
});

router.delete('/portfolio/:id', async (request, response, next) => {
  try {
    const items = await getPortfolio();
    const nextItems = items.filter((item) => item.id !== request.params.id);

    if (nextItems.length === items.length) {
      response.status(404).json({ message: 'Portfolio item not found.' });
      return;
    }

    response.json(await savePortfolio(nextItems));
  } catch (error) {
    next(error);
  }
});

router.get('/categories', async (_request, response, next) => {
  try {
    response.json(await getCategories());
  } catch (error) {
    next(error);
  }
});

router.post('/categories', async (request, response, next) => {
  try {
    const parsed = CategoryInputSchema.parse(request.body);
    const categories = await getCategories();
    const category = CategorySchema.parse({
      ...parsed,
      id: parsed.id ?? `cat-${slugify(parsed.name)}`,
      slug: parsed.slug ?? slugify(parsed.name),
    });

    if (categories.some((item) => item.id === category.id)) {
      response.status(409).json({ message: 'A category with this id already exists.' });
      return;
    }

    categories.push(category);
    response.status(201).json(await saveCategories(categories));
  } catch (error) {
    next(error);
  }
});

router.put('/categories/:id', async (request, response, next) => {
  try {
    const parsed = CategoryInputSchema.parse(request.body);
    const categories = await getCategories();
    const index = categories.findIndex((item) => item.id === request.params.id);

    if (index === -1) {
      response.status(404).json({ message: 'Category not found.' });
      return;
    }

    categories[index] = CategorySchema.parse({
      ...parsed,
      id: request.params.id,
      slug: parsed.slug ?? slugify(parsed.name),
    });

    response.json(await saveCategories(categories));
  } catch (error) {
    next(error);
  }
});

router.delete('/categories/:id', async (request, response, next) => {
  try {
    const categories = await getCategories();
    const nextCategories = categories.filter((item) => item.id !== request.params.id);

    if (nextCategories.length === categories.length) {
      response.status(404).json({ message: 'Category not found.' });
      return;
    }

    response.json(await saveCategories(nextCategories));
  } catch (error) {
    next(error);
  }
});

router.get('/uploads', async (_request, response, next) => {
  try {
    response.json(await listUploads());
  } catch (error) {
    next(error);
  }
});

router.post('/upload', upload.single('file'), async (request, response, next) => {
  try {
    if (!request.file) {
      response.status(400).json({ message: 'No file was uploaded.' });
      return;
    }

    response.status(201).json({
      filename: request.file.filename,
      mimeType: request.file.mimetype,
      size: request.file.size,
      url: `/uploads/${request.file.filename}`,
    });
  } catch (error) {
    next(error);
  }
});

export { router as adminRouter };
