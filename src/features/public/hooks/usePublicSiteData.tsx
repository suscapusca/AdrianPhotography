import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/shared/lib/api';
import type { Category, PortfolioItem, SiteContent } from '@/shared/lib/content-schema';

type PublicSiteContextValue = {
  site: SiteContent | null;
  portfolio: PortfolioItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const PublicSiteContext = createContext<PublicSiteContextValue | null>(null);

async function requestStaticJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error(`Unable to load fallback content from ${path}.`);
  }

  return (await response.json()) as T;
}

export function PublicSiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const [siteData, portfolioData, categoryData] = await Promise.all([
        apiRequest<SiteContent>('/api/site'),
        apiRequest<PortfolioItem[]>('/api/portfolio'),
        apiRequest<Category[]>('/api/categories'),
      ]);

      setSite(siteData);
      setPortfolio(portfolioData);
      setCategories(categoryData);
    } catch (caught) {
      try {
        const [siteData, portfolioData, categoryData] = await Promise.all([
          requestStaticJson<SiteContent>('/data/site.json'),
          requestStaticJson<PortfolioItem[]>('/data/portfolio.json'),
          requestStaticJson<Category[]>('/data/categories.json'),
        ]);

        setSite(siteData);
        setPortfolio(portfolioData);
        setCategories(categoryData);
        setError(null);
      } catch (fallbackError) {
        setError(
          fallbackError instanceof Error
            ? fallbackError.message
            : caught instanceof Error
              ? caught.message
              : 'Unable to load site content.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo(
    () => ({
      site,
      portfolio,
      categories,
      loading,
      error,
      refresh,
    }),
    [site, portfolio, categories, loading, error],
  );

  return <PublicSiteContext.Provider value={value}>{children}</PublicSiteContext.Provider>;
}

export function usePublicSiteData() {
  const context = useContext(PublicSiteContext);

  if (!context) {
    throw new Error('usePublicSiteData must be used inside PublicSiteProvider.');
  }

  return context;
}
