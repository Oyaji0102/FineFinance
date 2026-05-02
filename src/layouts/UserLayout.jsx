import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, FileText, LogOut, Sun, Moon, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import FirmProfile from '../pages/user/FirmProfile';
import UserReport from '../pages/user/UserReport';

const menuItems = [
  { path: '/user', label: 'Firma Bilgileri', icon: User },
  { path: '/user/report', label: 'Finansal Rapor', icon: FileText },
];

export default function UserLayout() {
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="layout-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="p-6 mb-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-primary)', letterSpacing: '-0.025em' }}>FineFin Portal</h2>
          </div>
          <nav className="flex flex-col gap-1 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/user' ? location.pathname === '/user' : location.pathname.startsWith(item.path);
              
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
            
            {/* Locked feature preview */}
            <div className="nav-item mt-2" style={{ border: '1px dashed var(--warning)', opacity: 0.8, cursor: 'not-allowed', backgroundColor: 'rgba(245, 158, 11, 0.05)' }} title="Premium Özellik">
              <Lock size={18} className="mr-2" style={{ color: 'var(--warning)' }} />
              Yapay Zeka Analizi
            </div>
          </nav>
        </div>
        
        <div className="p-4 flex flex-col gap-2 border-t" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-3 p-3 rounded-lg mb-2" style={{ backgroundColor: 'rgba(148, 163, 184, 0.05)', border: '1px solid var(--border-color)' }}>
             <div style={{ minWidth: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--brand-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              U
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Müşteri'}</span>
              <span className="text-xs text-muted truncate">Standart Paket</span>
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
            <Route path="/" element={<FirmProfile />} />
            <Route path="/report" element={<UserReport />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
