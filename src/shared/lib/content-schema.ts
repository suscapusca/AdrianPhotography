import { z } from 'zod';

export const MediaTypeSchema = z.enum(['photo', 'video']);

export const CtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const HeroMediaSchema = z.object({
  id: z.string().min(1),
  type: MediaTypeSchema,
  src: z.string().min(1),
  srcWebm: z.string().optional().default(''),
  poster: z.string().optional().default(''),
  title: z.string().min(1),
  alt: z.string().min(1),
});

export const HeroStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const HeroContentSchema = z.object({
  eyebrow: z.string().min(1),
  headlineLines: z.array(z.string().min(1)).min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  primaryCta: CtaSchema,
  secondaryCta: CtaSchema,
  heroMedia: HeroMediaSchema,
  stats: z.array(HeroStatSchema).min(1),
  featuredCategorySlugs: z.array(z.string().min(1)).min(1),
});

export const FeaturedCollectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  itemIds: z.array(z.string().min(1)),
});

export const AboutContentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  body: z.string().min(1),
  philosophy: z.string().min(1),
  portraitSrc: z.string().min(1),
  portraitAlt: z.string().min(1),
});

export const ServiceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
});

export const ContactContentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  linkedin: z.string().url(),
  instagram: z.string().url(),
  instagramHandle: z.string().min(1),
  location: z.string().min(1),
  inquiryCtaLabel: z.string().min(1),
});

export const SiteSettingsSchema = z.object({
  featuredItemIds: z.array(z.string().min(1)),
  featuredCategorySlugs: z.array(z.string().min(1)),
  showLightboxHint: z.boolean(),
});

export const SiteContentSchema = z.object({
  hero: HeroContentSchema,
  featuredCollection: FeaturedCollectionSchema,
  about: AboutContentSchema,
  services: z.array(ServiceItemSchema).min(1),
  contact: ContactContentSchema,
  homepageSettings: SiteSettingsSchema,
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  visible: z.boolean(),
  order: z.number().int(),
  accent: z.string().min(1),
});

export const PortfolioItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  categorySlug: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  mediaType: MediaTypeSchema,
  src: z.string().min(1),
  thumbnailSrc: z.string().min(1),
  posterSrc: z.string().min(1),
  alt: z.string().min(1),
  featured: z.boolean(),
  published: z.boolean(),
  order: z.number().int(),
  location: z.string().min(1),
  year: z.string().min(1),
  aspectRatio: z.enum(['portrait', 'landscape', 'square']),
  tags: z.array(z.string().min(1)),
});

export const PortfolioItemInputSchema = PortfolioItemSchema.partial({
  id: true,
  slug: true,
});

export const CategoryInputSchema = CategorySchema.partial({
  id: true,
  slug: true,
});

export const AdminSessionSchema = z.object({
  username: z.string().min(1),
  authenticatedAt: z.string().min(1),
});

export type MediaType = z.infer<typeof MediaTypeSchema>;
export type HeroMedia = z.infer<typeof HeroMediaSchema>;
export type HeroContent = z.infer<typeof HeroContentSchema>;
export type FeaturedCollection = z.infer<typeof FeaturedCollectionSchema>;
export type AboutContent = z.infer<typeof AboutContentSchema>;
export type ServiceItem = z.infer<typeof ServiceItemSchema>;
export type ContactContent = z.infer<typeof ContactContentSchema>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type SiteContent = z.infer<typeof SiteContentSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;
export type PortfolioItemInput = z.infer<typeof PortfolioItemInputSchema>;
export type CategoryInput = z.infer<typeof CategoryInputSchema>;
export type AdminSession = z.infer<typeof AdminSessionSchema>;
