import React, { useState, useEffect } from 'react';
import { Activity, Download, Filter } from 'lucide-react';
import { api } from '../../services/api';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getLogs(filter || null);
      setLogs(data);
    } catch (err) {
      setError(err.message || 'Loglar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getLogStats();
      setStats(data);
    } catch (err) {
      console.error('İstatistikler yüklenemedi:', err);
    }
  };

  const getActionColor = (actionType) => {
    const colors = {
      'LOGIN_SUCCESS': 'text-green-600 bg-green-50',
      'LOGIN_FAILED': 'text-red-600 bg-red-50',
      'FINANCIAL_REPORT_ADDED': 'text-blue-600 bg-blue-50',
      'FINANCIAL_REPORT_DELETED': 'text-orange-600 bg-orange-50',
      'MEMBERSHIP_UPGRADED': 'text-purple-600 bg-purple-50',
      'MEMBERSHIP_DOWNGRADED': 'text-amber-600 bg-amber-50',
      'CRUD_FIRM': 'text-indigo-600 bg-indigo-50',
      'DEFAULT': 'text-gray-600 bg-gray-50'
    };
    return colors[actionType] || colors['DEFAULT'];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#0f172a' }}>
          <Activity style={{ display: 'inline-block', marginRight: '0.5rem', marginBottom: '0.25rem' }} />
          Sistem Logları
        </h1>
        <p style={{ color: '#64748b' }}>Tüm sistem aktiviteleri ve kullanıcı işlemlerini izleyin</p>
      </div>

      {/* İstatistikler */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Bugün</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0e7490' }}>{stats.today}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Bu Hafta</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0e7490' }}>{stats.week}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Bu Ay</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0e7490' }}>{stats.month}</div>
          </div>
        </div>
      )}

      {/* Filtre */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Filter size={18} />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <option value="">Tüm İşlemler</option>
          <option value="LOGIN_SUCCESS">Başarılı Giriş</option>
          <option value="LOGIN_FAILED">Başarısız Giriş</option>
          <option value="FINANCIAL_REPORT_ADDED">Rapor Eklendi</option>
          <option value="FINANCIAL_REPORT_DELETED">Rapor Silindi</option>
          <option value="MEMBERSHIP_UPGRADED">Üyelik Yükseltildi</option>
          <option value="MEMBERSHIP_DOWNGRADED">Üyelik İndirildi</option>
          <option value="CRUD_FIRM">Firma İşlemi</option>
        </select>
      </div>

      {/* Loglar Tablosu */}
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Yükleniyor...
        </div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Log bulunamadı
        </div>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Tarih</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>İşlem Türü</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Kullanıcı ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Detaylar</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>
                    {formatDate(log.created_at)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action_type)}`}>
                      {log.action_type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569' }}>
                    {log.user_id ? `#${log.user_id}` : '-'}
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                    {log.details ? JSON.stringify(log.details).substring(0, 50) + '...' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        select option {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}
