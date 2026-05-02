import React from 'react';
import { ShieldCheck, TrendingDown, TrendingUp, Briefcase } from 'lucide-react';

export default function Investments() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Yatırım ve Portföy Takibi</h1>
          <p className="text-muted">Aktif yatırımlar, sektörel dağılım ve risk analizleri.</p>
        </div>
        <button className="btn btn-outline">
          <Briefcase size={18} />
          Portföy Raporu İndir
        </button>
      </div>

      {/* Top row: Risk Score & Sectoral Distribution */}
      <div className="flex gap-6">
        {/* Risk Score */}
        <div className="card flex flex-col items-center justify-center text-center gap-4" style={{ width: '300px' }}>
           <div className="flex items-center gap-2 text-brand-primary">
             <ShieldCheck size={24} />
             <h3 className="font-semibold text-lg">Genel Risk Skoru</h3>
           </div>
           
           <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(var(--success) 85%, var(--bg-tertiary) 0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
               <span className="text-3xl font-bold" style={{ color: 'var(--success)' }}>85</span>
               <span className="text-xs text-muted">/ 100</span>
             </div>
           </div>
           
           <div>
             <p className="font-semibold text-success">Stabil Büyüme Profili</p>
             <p className="text-xs text-muted mt-2">Portföyünüz yüksek dirence sahip, sektörel dalgalanmalardan minimum etkileniyor.</p>
           </div>
        </div>

        {/* Sectoral Distribution */}
        <div className="card flex-1">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-semibold">Sektörel Dağılım</h3>
             <div className="flex gap-2">
               <span className="badge badge-info">Çeyreklik</span>
               <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>Yıllık</span>
             </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">FinTech Çözümleri</span>
                <span className="text-muted">$124.5M (42%)</span>
              </div>
              <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">Temiz Enerji (Green Tech)</span>
                <span className="text-muted">$82.3M (28%)</span>
              </div>
              <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="h-full rounded-full" style={{ backgroundColor: 'var(--success)', width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">Sağlık Teknolojileri</span>
                <span className="text-muted">$44.1M (15%)</span>
              </div>
              <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="h-full rounded-full" style={{ backgroundColor: 'var(--warning)', width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">E-Ticaret Altyapıları</span>
                <span className="text-muted">$44.1M (15%)</span>
              </div>
              <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="h-full rounded-full" style={{ backgroundColor: 'var(--info)', width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Investments Table */}
      <div className="card p-0 overflow-hidden">
         <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
           <h3 className="font-semibold text-lg">Aktif Yatırımlar</h3>
         </div>
         <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th className="p-4 font-semibold text-sm text-secondary">Firma</th>
                <th className="p-4 font-semibold text-sm text-secondary">Sektör</th>
                <th className="p-4 font-semibold text-sm text-secondary">Yatırım Miktarı</th>
                <th className="p-4 font-semibold text-sm text-secondary">Getiri (ROI)</th>
                <th className="p-4 font-semibold text-sm text-secondary">Statü</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-tertiary transition-colors">
                 <td className="p-4 font-semibold">Stripe Payments</td>
                 <td className="p-4 text-sm text-muted">FinTech</td>
                 <td className="p-4 font-mono font-semibold">$12,450,000</td>
                 <td className="p-4 text-success flex items-center gap-1"><TrendingUp size={16} /> +24.5%</td>
                 <td className="p-4"><span className="badge badge-success">Güçlü Büyüme</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-tertiary transition-colors">
                 <td className="p-4 font-semibold">EcoVolt Energy</td>
                 <td className="p-4 text-sm text-muted">Green Tech</td>
                 <td className="p-4 font-mono font-semibold">$8,200,000</td>
                 <td className="p-4 text-warning flex items-center gap-1"><TrendingDown size={16} /> -2.1%</td>
                 <td className="p-4"><span className="badge badge-warning">Takipte</span></td>
              </tr>
            </tbody>
         </table>
      </div>
    </div>
  );
}
