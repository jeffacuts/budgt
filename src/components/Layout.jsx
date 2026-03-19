import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowDownLeft, ArrowUpRight, Landmark, Users } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Overzicht', icon: LayoutDashboard },
  { to: '/inkomsten', label: 'Inkomsten', icon: ArrowDownLeft },
  { to: '/uitgaven', label: 'Uitgaven', icon: ArrowUpRight },
  { to: '/schulden', label: 'Schulden', icon: Landmark },
  { to: '/contacten', label: 'Contacten', icon: Users },
];

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Landmark size={24} />
          </div>
          <div>
            <div className="brand-name">FinanceFlow</div>
            <div className="brand-sub">Persoonlijk beheer</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          © 2026 FinanceFlow
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
