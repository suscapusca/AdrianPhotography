import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminSession } from '../hooks/useAdminSession';

const adminNav = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Portfolio', to: '/admin/portfolio' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Content', to: '/admin/content' },
  { label: 'Media', to: '/admin/media' },
];

export function AdminShell() {
  const { session, logout } = useAdminSession();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="eyebrow">Private Area</p>
          <h1>Schipor Adrian</h1>
          <span>Signed in as {session?.username}</span>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                isActive ? 'admin-sidebar__link is-active' : 'admin-sidebar__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="button button--ghost"
          onClick={async () => {
            await logout();
            navigate('/admin/login');
          }}
        >
          Log out
        </button>
      </aside>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
