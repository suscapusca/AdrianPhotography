import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '@/shared/components/LoadingState';
import { useAdminSession } from '../hooks/useAdminSession';

export function AdminGuard({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAdminSession();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState label="Checking admin session..." />;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
