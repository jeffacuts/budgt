import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowDownLeft, ArrowUpRight, Landmark, Users } from 'lucide-react';


const navItems = [
  { to: '/overzicht', label: 'Overzicht', icon: LayoutDashboard },
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
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Budget</span>
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
          © 2026 Budgt
        </div>
      </aside>
      <main className="main-content" style={{ position: 'relative', overflow: 'hidden' }}>
        <video
          autoPlay muted loop playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.5,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'relative', zIndex: 1, height: '100%', overflow: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
