import React from 'react';
import { FileSignature, CreditCard, Clock, AlertCircle } from 'lucide-react';

export default function Settings() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mali Yapımız & Sözleşmeler</h1>
          <p className="text-muted">Danışmanlık firmasına ait iç finansal yönetim, abonelikler ve tahsilat takibi.</p>
        </div>
      </div>

      <div className="flex gap-6">
        
        {/* Left Column: Contracts & Subscriptions */}
        <div className="flex flex-col gap-6" style={{ flex: 2 }}>
          {/* Active Contracts */}
          <div className="card p-0 overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <FileSignature size={20} className="text-brand-primary" />
                <h3 className="font-semibold text-lg">Aktif Danışmanlık Sözleşmeleri</h3>
              </div>
              <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Sözleşme Ekle</button>
            </div>
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th className="p-4 font-semibold text-sm text-secondary">Firma</th>
                  <th className="p-4 font-semibold text-sm text-secondary">Paket</th>
                  <th className="p-4 font-semibold text-sm text-secondary">Başlangıç</th>
                  <th className="p-4 font-semibold text-sm text-secondary">Bitiş / Yenileme</th>
                  <th className="p-4 font-semibold text-sm text-secondary text-right">Tutar (Aylık)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-tertiary transition-colors">
                   <td className="p-4 font-semibold">Global Fintech Corp</td>
                   <td className="p-4"><span className="badge badge-info">Premium AI</span></td>
                   <td className="p-4 text-sm text-muted">01.01.2024</td>
                   <td className="p-4 text-sm font-semibold">31.12.2024</td>
                   <td className="p-4 text-right font-mono font-semibold">₺45,000</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-tertiary transition-colors">
                   <td className="p-4 font-semibold">Vertex Logistics LLC</td>
                   <td className="p-4"><span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Standart</span></td>
                   <td className="p-4 text-sm text-muted">15.03.2024</td>
                   <td className="p-4 text-sm font-semibold">15.03.2025</td>
                   <td className="p-4 text-right font-mono font-semibold">₺20,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pending Collections */}
          <div className="card p-0 overflow-hidden border-warning" style={{ border: '1px solid var(--warning)' }}>
            <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
              <Clock size={20} className="text-warning" />
              <h3 className="font-semibold text-lg text-warning">Geciken Tahsilatlar</h3>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-4">
                   <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)' }}>
                     <AlertCircle size={24} />
                   </div>
                   <div>
                     <p className="font-semibold">IronClad Industries</p>
                     <p className="text-sm text-danger mt-1">14 Gün Gecikme - Nisan Ayı Faturası</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xl font-mono font-bold text-danger">₺20,000</p>
                   <button className="btn btn-outline mt-2" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Hatırlatma Gönder</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary */}
        <div className="flex flex-col gap-6" style={{ flex: 1 }}>
           <div className="card flex flex-col h-full" style={{ backgroundColor: 'var(--brand-primary)', color: 'white', border: 'none' }}>
             <h3 className="font-semibold text-lg mb-6 opacity-90 flex items-center gap-2">
               <CreditCard size={20} /> Aylık Finansal Özet
             </h3>
             
             <div className="mb-6">
               <p className="text-sm opacity-80 mb-1">Beklenen Aylık Gelir</p>
               <p className="text-3xl font-bold font-mono">₺65,000</p>
             </div>

             <div className="mb-6">
               <p className="text-sm opacity-80 mb-1">Gerçekleşen Tahsilat</p>
               <p className="text-2xl font-bold font-mono text-green-300">₺45,000</p>
               <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-2">
                 <div className="bg-white h-full rounded-full" style={{ width: '69%' }}></div>
               </div>
             </div>

             <div className="mt-auto">
               <button className="btn w-full" style={{ backgroundColor: 'white', color: 'var(--brand-primary)', fontWeight: 'bold' }}>
                 Detaylı Bilanço İndir
               </button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
