import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AdminSessionProvider } from '@/features/admin/hooks/useAdminSession';
import { AdminCategoriesPage } from '@/features/admin/pages/AdminCategoriesPage';
import { AdminContentPage } from '@/features/admin/pages/AdminContentPage';
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { AdminLoginPage } from '@/features/admin/pages/AdminLoginPage';
import { AdminMediaPage } from '@/features/admin/pages/AdminMediaPage';
import { AdminPortfolioPage } from '@/features/admin/pages/AdminPortfolioPage';
import { AdminGuard } from '@/features/admin/components/AdminGuard';
import { AdminShell } from '@/features/admin/components/AdminShell';
import { PublicLayout } from '@/features/public/components/PublicLayout';
import { AboutPage } from '@/features/public/pages/AboutPage';
import { ContactPage } from '@/features/public/pages/ContactPage';
import { HomePage } from '@/features/public/pages/HomePage';
import { PortfolioPage } from '@/features/public/pages/PortfolioPage';
import { ServicesPage } from '@/features/public/pages/ServicesPage';
import { RouteScrollManager } from './RouteScrollManager';

function AdminProvidersOutlet() {
  return (
    <AdminSessionProvider>
      <Outlet />
    </AdminSessionProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteScrollManager />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route element={<AdminProvidersOutlet />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminShell />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="portfolio" element={<AdminPortfolioPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="media" element={<AdminMediaPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
