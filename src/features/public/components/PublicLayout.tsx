import { Outlet } from 'react-router-dom';
import { LoadingState } from '@/shared/components/LoadingState';
import { PublicSiteProvider, usePublicSiteData } from '../hooks/usePublicSiteData';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

function PublicShell() {
  const { site, loading } = usePublicSiteData();

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>{loading && !site ? <LoadingState /> : <Outlet />}</main>
      <SiteFooter contact={site?.contact} />
    </div>
  );
}

export function PublicLayout() {
  return (
    <PublicSiteProvider>
      <PublicShell />
    </PublicSiteProvider>
  );
}
