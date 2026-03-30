import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Seo } from '@/shared/components/Seo';
import { useAdminSession } from '../hooks/useAdminSession';

type LocationState = {
  from?: string;
};

export function AdminLoginPage() {
  const { session, login } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('change-me');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ username, password });
      navigate(state?.from ?? '/admin', { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Admin Login | Schipor Adrian" description="Private management area" />

      <div className="admin-login">
        <form className="admin-login__card" onSubmit={handleSubmit}>
          <p className="eyebrow">Private Access</p>
          <h1>Admin login</h1>
          <p>
            Use the credentials defined in the environment variables to manage portfolio items,
            categories, hero content, and contact details.
          </p>

          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Enter dashboard'}
          </button>

          {error ? <p className="form-status form-status--error">{error}</p> : null}
        </form>
      </div>
    </>
  );
}
