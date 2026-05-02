import React, { useState } from 'react';
import { Lock, FileBarChart2, Zap, ArrowRight, ShieldCheck, Play } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

export default function UserReport() {
  const { user } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [buying, setBuying] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);

  const handlePurchase = async () => {
    setBuying(true);
    try {
      const res = await api.purchasePremium(user.id, 'premium');
      setPurchaseStatus(res.message);
    } catch (error) {
      console.error(error);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Finansal Raporunuz</h1>
          <p className="text-muted">Firmanızın mali durumu ve temel analizleri.</p>
        </div>
      </div>

      {/* Main KPIs (Visible to standard users) */}
      <div className="flex gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card">
          <p className="text-sm text-secondary font-semibold mb-1">Dönen Varlıklar</p>
          <p className="text-2xl font-bold font-mono">₺4,290,150</p>
          <p className="text-xs text-success mt-2">+12.4% (Önceki Dönem)</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary font-semibold mb-1">Toplam Borçlar</p>
          <p className="text-2xl font-bold font-mono">₺1,840,000</p>
          <p className="text-xs text-danger mt-2">+3.2% (Önceki Dönem)</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary font-semibold mb-1">Net Gelir</p>
          <p className="text-2xl font-bold font-mono text-brand-primary">₺842,500</p>
          <p className="text-xs text-success mt-2">+8.1% (Önceki Dönem)</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Basic Tables */}
        <div className="card flex-1">
           <h3 className="font-semibold text-lg mb-4">Nakit Akış Özeti</h3>
           <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td className="py-3 text-secondary">Nakit ve Benzerleri</td>
                  <td className="py-3 text-right font-mono font-semibold">₺1,234,000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td className="py-3 text-secondary">Ticari Alacaklar</td>
                  <td className="py-3 text-right font-mono font-semibold">₺645,000</td>
                </tr>
                <tr>
                  <td className="py-3 text-secondary">Kısa Vadeli Borçlar</td>
                  <td className="py-3 text-right font-mono font-semibold text-danger">₺420,000</td>
                </tr>
              </tbody>
           </table>
        </div>

        {/* Premium AI Section (Locked) */}
        <div className="card flex flex-col items-center justify-center text-center relative overflow-hidden" style={{ width: '400px', border: '1px solid var(--warning)' }}>
           
           {/* Blurred/Locked Content Background */}
           <div className="absolute inset-0 opacity-10 flex flex-col p-6 pointer-events-none" style={{ filter: 'blur(4px)' }}>
             <h4 className="font-bold text-left mb-2">AI Analizi</h4>
             <p className="text-left text-sm mb-4">TechCorp A.S. shows strong liquidity ratios with an upward trend in current assets. Debt-to-equity remains stable.</p>
             <div className="w-full h-8 bg-gray-500 rounded mb-2"></div>
             <div className="w-3/4 h-8 bg-gray-500 rounded"></div>
           </div>

           {/* Lock Overlay */}
           <div className="relative z-10 flex flex-col items-center gap-3">
             <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', color: 'var(--warning)' }}>
               <Lock size={32} />
             </div>
             <h3 className="font-bold text-lg">Yapay Zeka Analizi</h3>
             <p className="text-sm text-muted px-4">Yapay zeka destekli detaylı finansal rasyo analizi, risk raporları ve sektörel karşılaştırmalar için Premium Pakete geçin.</p>
             <button className="btn btn-primary mt-2" style={{ backgroundColor: 'var(--warning)', color: 'var(--bg-primary)' }} onClick={() => setShowPremiumModal(true)}>
               <Zap size={18} fill="currentColor" />
               Premium'a Yükselt
             </button>
           </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 page-transition" style={{ backgroundColor: 'rgba(11, 17, 32, 0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="card relative w-full" style={{ maxWidth: '500px', backgroundColor: 'var(--bg-primary)' }}>
            
            {!purchaseStatus ? (
              <>
                <button 
                  className="absolute top-4 right-4 text-muted hover:text-primary" 
                  onClick={() => setShowPremiumModal(false)}
                >
                  X
                </button>
                <div className="text-center mb-6">
                  <div className="mx-auto mb-4" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">Premium Paket</h2>
                  <p className="text-muted mt-2">Firmanızın verilerini yapay zeka ile analiz edin.</p>
                </div>
                
                <ul className="flex flex-col gap-3 mb-6">
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="text-success" size={18}/> Sınırsız OCR Belge Okuma</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="text-success" size={18}/> Detaylı LLM Finansal Analizi</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="text-success" size={18}/> Otomatik .pptx Sunum Üretimi</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="text-success" size={18}/> Sektörel Karşılaştırma Skoru</li>
                </ul>

                <div className="p-4 rounded-lg flex justify-between items-center mb-6" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <span className="font-semibold">Aylık Tutar</span>
                  <span className="text-2xl font-bold font-mono">₺5,000</span>
                </div>

                <button 
                  className="btn w-full justify-center" 
                  style={{ backgroundColor: 'var(--warning)', color: 'var(--bg-primary)', fontWeight: 'bold' }}
                  onClick={handlePurchase}
                  disabled={buying}
                >
                  {buying ? 'Talep Gönderiliyor...' : 'Satın Alma Talebi Gönder'}
                  {!buying && <ArrowRight size={18} />}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Talebiniz Alındı!</h2>
                <p className="text-muted mb-6">{purchaseStatus}</p>
                <button className="btn btn-outline w-full justify-center" onClick={() => setShowPremiumModal(false)}>Kapat</button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
