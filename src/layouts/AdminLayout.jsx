import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, LineChart, FileText, Settings as SettingsIcon, LogOut, Sun, Moon, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Dashboard from '../pages/admin/Dashboard';
import Firms from '../pages/admin/Firms';
import Reports from '../pages/admin/Reports';
import Investments from '../pages/admin/Investments';
import Settings from '../pages/admin/Settings';
import Logs from '../pages/admin/Logs';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/firms', label: 'Firmalar', icon: Building2 },
  { path: '/admin/reports', label: 'Finansal Raporlar', icon: FileText },
  { path: '/admin/investments', label: 'Yatırım', icon: LineChart },
  { path: '/admin/logs', label: 'Sistem Logları', icon: Activity },
  { path: '/admin/settings', label: 'Mali Yapımız', icon: SettingsIcon },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="layout-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="p-6 mb-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-primary)', letterSpacing: '-0.025em' }}>FineFin Admin</h2>
          </div>
          <nav className="flex flex-col gap-1 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Strict exact match for dashboard, startswith for others
              const isActive = item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 flex flex-col gap-2 border-t" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-3 p-3 rounded-lg mb-2" style={{ backgroundColor: 'rgba(148, 163, 184, 0.05)', border: '1px solid var(--border-color)' }}>
            <div style={{ minWidth: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              A
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Admin User'}</span>
              <span className="text-xs text-muted truncate">Sistem Yöneticisi</span>
            </div>
          </div>
          
          <button className="btn btn-outline w-full justify-start" onClick={toggleTheme} style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
          </button>
          
          <button className="btn btn-danger-ghost w-full justify-start" onClick={logout} style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div key={location.pathname} className="container page-transition">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/firms" element={<Firms />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
