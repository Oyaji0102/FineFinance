import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, CheckCircle2, AlertCircle, UploadCloud, FileText, Download, X } from 'lucide-react';
import { api } from '../../services/api';

export default function Firms() {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [firmReports, setFirmReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const loadFirmReports = async (firmId) => {
    setReportsLoading(true);
    try {
      const data = await api.getFirmReports(firmId);
      setFirmReports(data);
    } catch (error) {
      console.error("Reports couldn't be loaded", error);
      setFirmReports([]);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleFirmClick = (firm) => {
    setSelectedFirm(firm);
    loadFirmReports(firm.id);
    setShowModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedFirm) return;

    setUploadingFile(true);
    try {
      await api.uploadFinancialReport(selectedFirm.id, file);
      // Raporları yenile
      loadFirmReports(selectedFirm.id);
    } catch (error) {
      console.error("Dosya yüklenemedi", error);
      alert('Dosya yüklenirken hata oluştu: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!confirm('Bu raporu silmek istediğinize emin misiniz?')) return;
    
    try {
      await api.deleteReport(reportId);
      loadFirmReports(selectedFirm.id);
    } catch (error) {
      console.error("Rapor silinemedi", error);
      alert('Rapor silinirken hata oluştu');
    }
  };

  const filteredFirms = firms.filter(firm => 
    firm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    firm.taxId.includes(searchQuery)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a' }}>Firma Yönetimi</h1>
          <p style={{ color: '#64748b' }}>Müşteri firmalarını ve finansal raporlarını yönetin.</p>
        </div>
        <button style={{
          backgroundColor: '#0e7490',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Plus size={18} />
          Yeni Firma Ekle
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '300px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Firma Adı veya VKN Ara..." 
            style={{
              width: '100%',
              paddingLeft: '36px',
              padding: '0.75rem',
              paddingLeft: '36px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem'
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <UploadCloud size={16} /> Toplu İçe Aktar (CSV)
          </button>
        </div>
      </div>

      {/* Firms Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Firmalar yükleniyor...</div>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>Firma Ünvanı</th>
                <th style={{ padding: '1rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>Vergi No (VKN)</th>
                <th style={{ padding: '1rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>Durum</th>
                <th style={{ padding: '1rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569' }}>AI Doğrulama</th>
                <th style={{ padding: '1rem', fontWeight: '600', fontSize: '0.875rem', color: '#475569', textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredFirms.map((firm) => (
                <tr key={firm.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontWeight: '600', color: '#0f172a' }} onClick={() => handleFirmClick(firm)}>{firm.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Kayıt: 2024</p>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontFamily: 'monospace', color: '#64748b' }}>{firm.taxId}</td>
                  <td style={{ padding: '1rem' }}>
                    {firm.status === 'Active' && (
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={12} /> Aktif
                      </span>
                    )}
                    {firm.status === 'Processing' && (
                      <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '500' }}>
                        İşleniyor
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '100px', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${firm.aiVerification}%`, 
                            backgroundColor: firm.aiVerification === 100 ? '#0e7490' : '#f59e0b',
                            transition: 'width 0.3s'
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>{firm.aiVerification}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => handleFirmClick(firm)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                      <FileText size={16} color='#0e7490' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredFirms.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Aranan kriterlere uygun firma bulunamadı.
          </div>
        )}
      </div>

      {/* Firma Detay Modal */}
      {showModal && selectedFirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              borderBottom: '1px solid #e2e8f0',
              position: 'sticky',
              top: 0,
              backgroundColor: '#f8fafc'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>
                {selectedFirm.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
              >
                <X size={20} color='#64748b' />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              {/* File Upload */}
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '2px dashed #0284c7',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <label style={{ cursor: 'pointer' }}>
                  <UploadCloud size={32} color='#0284c7' style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontWeight: '600', color: '#0c4a6e', marginBottom: '0.25rem' }}>
                    Finansal Rapor Yükle
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#0369a1' }}>
                    PDF, Excel veya Görsel dosya seçin
                  </p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    style={{ display: 'none' }}
                    accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
                  />
                </label>
              </div>

              {/* Reports List */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
                  Yüklenen Raporlar
                </h3>
                
                {reportsLoading ? (
                  <p style={{ color: '#64748b' }}>Raporlar yükleniyor...</p>
                ) : firmReports.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Henüz rapor yüklenmedi</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {firmReports.map((report) => (
                      <div
                        key={report.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          padding: '1rem',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>
                            {report.file_name}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                            {formatDate(report.created_at)}
                          </p>
                          {report.financial_score && (
                            <p style={{ fontSize: '0.875rem', color: '#0e7490', marginTop: '0.25rem' }}>
                              Skor: {report.financial_score.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            padding: '0.5rem'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
