import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest, ApiError } from '@/shared/lib/api';
import type { AdminSession } from '@/shared/lib/content-schema';

type LoginPayload = {
  username: string;
  password: string;
};

type AdminSessionContextValue = {
  session: AdminSession | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    try {
      const next = await apiRequest<AdminSession>('/api/auth/session');
      setSession(next);
    } catch (caught) {
      if (!(caught instanceof ApiError) || caught.status !== 401) {
        console.error(caught);
      }
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const login = async ({ username, password }: LoginPayload) => {
    const next = await apiRequest<AdminSession>('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    setSession(next);
  };

  const logout = async () => {
    await apiRequest<{ success: true }>('/api/auth/logout', { method: 'POST' });
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      isLoading,
      login,
      logout,
      refresh,
    }),
    [session, isLoading],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error('useAdminSession must be used inside AdminSessionProvider.');
  }

  return context;
}
