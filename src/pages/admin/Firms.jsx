import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import { api } from '../../services/api';

export default function Firms() {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFirms();
  }, []);

  const loadFirms = async () => {
    setLoading(true);
    try {
      const data = await api.getFirms();
      setFirms(data);
    } catch (error) {
      console.error("Firms couldn't be loaded", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFirms = firms.filter(firm => 
    firm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    firm.taxId.includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Firma Yönetimi</h1>
          <p className="text-muted">Müşteri firmalarını ve sözleşme durumlarını yönetin.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Yeni Firma Ekle
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-secondary p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-2" style={{ width: '300px', position: 'relative' }}>
          <Search size={18} className="text-muted" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Firma Adı veya VKN Ara..." 
            className="input-base"
            style={{ paddingLeft: '36px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline"><UploadCloud size={18} /> Toplu İçe Aktar (CSV)</button>
        </div>
      </div>

      {/* Firms Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="p-8 text-center text-muted">Firmalar yükleniyor...</div>
        ) : (
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th className="p-4 font-semibold text-sm text-secondary">Firma Ünvanı</th>
                <th className="p-4 font-semibold text-sm text-secondary">Vergi No (VKN)</th>
                <th className="p-4 font-semibold text-sm text-secondary">Durum</th>
                <th className="p-4 font-semibold text-sm text-secondary">AI Doğrulama</th>
                <th className="p-4 font-semibold text-sm text-secondary text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredFirms.map((firm) => (
                <tr key={firm.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-tertiary transition-colors">
                  <td className="p-4">
                    <p className="font-semibold">{firm.name}</p>
                    <p className="text-xs text-muted">Kayıt: 2024</p>
                  </td>
                  <td className="p-4 text-sm font-mono text-muted">{firm.taxId}</td>
                  <td className="p-4">
                    {firm.status === 'Active' && <span className="badge badge-success"><CheckCircle2 size={12} className="mr-1" /> Aktif</span>}
                    {firm.status === 'Processing' && <span className="badge badge-warning">İşleniyor</span>}
                    {firm.status === 'Conflict' && <span className="badge badge-danger"><AlertCircle size={12} className="mr-1" /> Sorunlu</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden" style={{ width: '100px', backgroundColor: 'var(--border-color)' }}>
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${firm.aiVerification}%`, 
                            backgroundColor: firm.aiVerification === 100 ? 'var(--brand-primary)' : firm.aiVerification > 50 ? 'var(--warning)' : 'var(--danger)' 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold">{firm.aiVerification}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="btn btn-ghost" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                    <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                    <button className="btn btn-ghost" style={{ padding: '0.5rem' }}><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredFirms.length === 0 && (
          <div className="p-8 text-center text-muted">
            Aranan kriterlere uygun firma bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
