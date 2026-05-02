import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Play, Download, AlertTriangle, FileBarChart2 } from 'lucide-react';
import { api } from '../../services/api';

export default function Reports() {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = React.useRef(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    estimatedRevenue: '',
    currentAssets: '',
    fixedAssets: '',
    totalAssets: '',
    equity: '',
    totalLiabilities: '',
    shortTermLiabilities: '',
    longTermLiabilities: '',
    netIncome: '',
    grossProfit: '',
    findeksScore: '',
    findeksReportDate: '',
    totalCreditLimit: '',
    totalCreditRisk: '',
    riskUtilizationRatio: '',
    overdueBalance: '',
    nplCount: '',
    bankDeposits: '',
    bankDetails: []
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('uploading');
    try {
      const response = await api.uploadDocument(file);
      if (response.success) {
        const d = response.extractedData;
        setFormData({
          name: d.name || '',
          estimatedRevenue: d.estimated_revenue || '',
          currentAssets: d.current_assets || '',
          fixedAssets: d.fixed_assets || '',
          totalAssets: d.total_assets || '',
          equity: d.equity || '',
          totalLiabilities: d.total_liabilities || '',
          shortTermLiabilities: d.short_term_liabilities || '',
          longTermLiabilities: d.long_term_liabilities || '',
          netIncome: d.net_income || '',
          grossProfit: d.gross_profit || '',
          findeksScore: d.findeks_score || '',
          findeksReportDate: d.findeks_report_date || '',
          totalCreditLimit: d.total_credit_limit || '',
          totalCreditRisk: d.total_credit_risk || '',
          riskUtilizationRatio: d.risk_utilization_ratio || '',
          overdueBalance: d.overdue_balance || '',
          nplCount: d.npl_count || '',
          bankDeposits: d.bank_deposits || '',
          bankDetails: Array.isArray(d.bank_details) ? d.bank_details : []
        });
        setUploadStatus('success');
      }
    } catch (error) {
      setUploadStatus('idle');
      alert(error.message || "Yükleme başarısız oldu.");
      console.error(error);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await api.generateAiAnalysis(formData);
      setAnalysisResult(response.report || response);
    } catch (error) {
      alert(error.message || "Analiz sırasında hata oluştu");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadPptx = async () => {
    try {
      const response = await api.generatePptx(formData);
      if (response.success) {
        const a = document.createElement('a');
        a.href = response.downloadUrl;
        a.download = 'finansal_sunum.pptx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      alert(error.message || "Sunum indirilirken hata oluştu");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Finansal Raporlar & AI Analizi</h1>
          <p className="text-muted">Mali verileri yükleyin, yapay zeka ile analiz edin ve sunum hazırlayın.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={handleDownloadPptx}>
            <Download size={18} />
            .pptx İndir
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Column: Upload & Data Form */}
        <div className="flex flex-col gap-6" style={{ flex: 1 }}>
          
          {/* Upload Area */}
          <div className="card text-center flex flex-col items-center justify-center gap-4" style={{ borderStyle: 'dashed', borderWidth: '2px', backgroundColor: 'var(--bg-primary)', padding: '3rem' }}>
            {uploadStatus === 'idle' && (
              <>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '50%', color: 'var(--brand-primary)' }}>
                  <UploadCloud size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Mali Tablo Yükle (PDF/Görsel)</h3>
                  <p className="text-muted text-sm mb-4">Sürükleyip bırakın veya bilgisayarınızdan seçin. Sistem OCR ile otomatik tarayacaktır.</p>
                </div>
                <button className="btn btn-primary" onClick={triggerFileInput}>Dosya Seç</button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*,application/pdf" 
                  style={{ display: 'none' }} 
                />
              </>
            )}
            {uploadStatus === 'uploading' && (
              <div className="flex flex-col items-center gap-4 text-brand-primary">
                <UploadCloud className="animate-pulse" size={32} />
                <p className="font-semibold">OCR Yapay Zeka Belgeyi Okuyor...</p>
                <div className="w-full bg-secondary rounded-full h-2 mt-2" style={{ maxWidth: '200px' }}>
                  <div className="bg-brand-primary h-2 rounded-full" style={{ width: '60%', transition: 'width 1s ease-in-out' }}></div>
                </div>
              </div>
            )}
            {uploadStatus === 'success' && (
              <div className="flex flex-col items-center gap-2 text-success">
                <CheckCircle2 size={48} />
                <p className="font-semibold text-lg">Belge Başarıyla İncenlendi!</p>
                <p className="text-muted text-sm text-primary">Veriler aşağıya otomatik olarak aktarıldı.</p>
              </div>
            )}
          </div>

          {/* Extracted Data Form */}
          <div className="card">
            <h3 className="font-semibold mb-4 text-lg">Finansal Veri Merkezi (Düzenlenebilir)</h3>
            <div className="flex flex-col gap-6" style={{ maxHeight: '700px', overflowY: 'auto', paddingRight: '10px' }}>
              
              {/* Bölüm 1: Temel Bilgiler & Mizan */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>📊 Gelir Tablosu & Bilanço</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-secondary mb-1 block">Firma/Kişi Adı</label>
                    <input type="text" className="input-base" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Net Satışlar / Ciro</label>
                    <input type="number" className="input-base" value={formData.estimatedRevenue} onChange={(e) => setFormData({...formData, estimatedRevenue: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Brüt Kar</label>
                    <input type="number" className="input-base" value={formData.grossProfit} onChange={(e) => setFormData({...formData, grossProfit: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Dönen Varlıklar</label>
                    <input type="number" className="input-base" value={formData.currentAssets} onChange={(e) => setFormData({...formData, currentAssets: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Duran Varlıklar</label>
                    <input type="number" className="input-base" value={formData.fixedAssets} onChange={(e) => setFormData({...formData, fixedAssets: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Toplam Aktif</label>
                    <input type="number" className="input-base" value={formData.totalAssets} onChange={(e) => setFormData({...formData, totalAssets: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Özkaynak</label>
                    <input type="number" className="input-base" value={formData.equity} onChange={(e) => setFormData({...formData, equity: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Kısa Vadeli Borç</label>
                    <input type="number" className="input-base" value={formData.shortTermLiabilities} onChange={(e) => setFormData({...formData, shortTermLiabilities: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Uzun Vadeli Borç</label>
                    <input type="number" className="input-base" value={formData.longTermLiabilities} onChange={(e) => setFormData({...formData, longTermLiabilities: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-secondary mb-1 block">Dönem Net Karı / Zararı</label>
                    <input type="number" className="input-base" value={formData.netIncome} onChange={(e) => setFormData({...formData, netIncome: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: Findeks Risk Raporu */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>🏦 Findeks Risk & Kredi Raporu</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Findeks Kredi Notu <span style={{color:'var(--brand-primary)'}}>(0-1900)</span></label>
                    <input type="number" className="input-base" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: formData.findeksScore > 1400 ? 'var(--success)' : formData.findeksScore > 900 ? 'var(--warning)' : '#ef4444' }} value={formData.findeksScore} onChange={(e) => setFormData({...formData, findeksScore: e.target.value})} placeholder="Örn: 1540" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Rapor Tarihi</label>
                    <input type="text" className="input-base" value={formData.findeksReportDate} onChange={(e) => setFormData({...formData, findeksReportDate: e.target.value})} placeholder="GG/AA/YYYY" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Toplam Kredi Limiti</label>
                    <input type="number" className="input-base" value={formData.totalCreditLimit} onChange={(e) => setFormData({...formData, totalCreditLimit: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Kullanılan Kredi (Risk)</label>
                    <input type="number" className="input-base" value={formData.totalCreditRisk} onChange={(e) => setFormData({...formData, totalCreditRisk: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Kullanım Oranı (%)</label>
                    <input type="number" className="input-base" value={formData.riskUtilizationRatio} onChange={(e) => setFormData({...formData, riskUtilizationRatio: e.target.value})} placeholder="0-100" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Gecikmiş Bakiye</label>
                    <input type="number" className="input-base" style={{color: formData.overdueBalance > 0 ? '#ef4444' : 'inherit'}} value={formData.overdueBalance} onChange={(e) => setFormData({...formData, overdueBalance: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Takipteki Kredi Sayısı</label>
                    <input type="number" className="input-base" value={formData.nplCount} onChange={(e) => setFormData({...formData, nplCount: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-secondary mb-1 block">Banka Mevduatı</label>
                    <input type="number" className="input-base" value={formData.bankDeposits} onChange={(e) => setFormData({...formData, bankDeposits: e.target.value})} />
                  </div>
                </div>

                {/* Banka Detayları Tablosu */}
                {formData.bankDetails && formData.bankDetails.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <label className="text-sm font-semibold text-secondary mb-2 block">Banka Bazlı Kredi Dağılımı</label>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid var(--border-color)' }}>Banka</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid var(--border-color)' }}>Tür</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid var(--border-color)' }}>Limit</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid var(--border-color)' }}>Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.bankDetails.map((bank, i) => (
                            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)' }}>
                              <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)', fontWeight: '500' }}>{bank.bank_name || '-'}</td>
                              <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{bank.credit_type || '-'}</td>
                              <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)', textAlign: 'right' }}>{bank.limit ? Number(bank.limit).toLocaleString('tr-TR') + ' ₺' : '-'}</td>
                              <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)', textAlign: 'right', color: bank.risk > 0 ? 'var(--warning)' : 'inherit' }}>{bank.risk ? Number(bank.risk).toLocaleString('tr-TR') + ' ₺' : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-2">
                <button className="btn btn-outline">Değişiklikleri Kaydet</button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis */}
        <div className="flex flex-col gap-6" style={{ width: '400px' }}>
          <div className="card flex flex-col h-full" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}>
            <div className="flex items-center gap-2 mb-6" style={{ color: 'var(--brand-primary)' }}>
              <FileBarChart2 size={24} />
              <h3 className="font-bold text-lg">Yapay Zeka Analizi</h3>
            </div>
            
            {!analysisResult && !analyzing && (
              <div className="flex flex-col items-center justify-center flex-1 text-center h-full gap-4 opacity-70">
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                   <Play size={24} className="text-muted" />
                </div>
                <p className="text-muted text-sm">Finansal verileri analiz etmek ve güçlü/zayıf yönleri görmek için analizi başlatın.</p>
                <button 
                  className="btn btn-primary w-full mt-4" 
                  onClick={handleAiAnalysis}
                  disabled={uploadStatus !== 'success'}
                >
                  <Play size={18} />
                  Analizi Başlat
                </button>
                {uploadStatus !== 'success' && <p className="text-xs text-warning mt-2">Analiz için önce belge yüklemelisiniz.</p>}
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center flex-1 text-center h-full gap-4">
                 <div className="animate-spin text-brand-primary">
                    <AlertTriangle size={32} />
                 </div>
                 <p className="font-semibold">LLM Modelleri Veriyi Yorumluyor...</p>
                 <p className="text-muted text-sm">Lütfen bekleyin, rapor oluşturuluyor.</p>
              </div>
            )}

            {analysisResult && (
              <div className="flex flex-col gap-4 page-transition" style={{ overflowY: 'auto', maxHeight: '580px' }}>

                {Array.isArray(analysisResult.strengths) && analysisResult.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--success)' }}>
                      <CheckCircle2 size={16} /> Güçlü Yönler
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {analysisResult.strengths.map((item, idx) => (
                        <li key={idx} className="text-sm p-3 rounded-md" style={{ backgroundColor: 'var(--bg-primary)', borderLeft: '3px solid var(--success)' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(analysisResult.weaknesses) && analysisResult.weaknesses.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--warning)' }}>
                      <AlertTriangle size={16} /> Zayıf Yönler
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {analysisResult.weaknesses.map((item, idx) => (
                        <li key={idx} className="text-sm p-3 rounded-md" style={{ backgroundColor: 'var(--bg-primary)', borderLeft: '3px solid var(--warning)' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(analysisResult.risks) && analysisResult.risks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: '#ef4444' }}>
                      <AlertTriangle size={16} /> Riskler
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {analysisResult.risks.map((item, idx) => (
                        <li key={idx} className="text-sm p-3 rounded-md" style={{ backgroundColor: 'var(--bg-primary)', borderLeft: '3px solid #ef4444' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(analysisResult.recommendations) && analysisResult.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--brand-primary)' }}>
                      <Play size={16} /> Öneriler
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {analysisResult.recommendations.map((item, idx) => (
                        <li key={idx} className="text-sm p-3 rounded-md" style={{ backgroundColor: 'var(--bg-primary)', borderLeft: '3px solid var(--brand-primary)' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="btn btn-outline w-full mt-2" onClick={() => setAnalysisResult(null)}>
                  Yeni Analiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
