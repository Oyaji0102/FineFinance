import React from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Firmaların Finansal Durumu</h1>
          <p className="text-muted">Tüm portföyün genel bakış ve performans metrikleri.</p>
        </div>
        <button className="btn btn-primary">
          <Activity size={18} />
          Genel Rapor İndir
        </button>
      </div>

      {/* KPI Cards */}
      <div className="flex gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', backgroundColor: 'rgba(2, 132, 199, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--brand-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary font-semibold">Toplam Firma</p>
            <p className="text-2xl font-bold">1,284</p>
          </div>
        </div>
        
        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary font-semibold">Aktif İşlemler</p>
            <p className="text-2xl font-bold">42</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-secondary font-semibold">Bekleyen Tahsilat</p>
            <p className="text-2xl font-bold">₺450K</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Tables Placeholder */}
      <div className="flex gap-6 mt-4">
        <div className="card flex-1" style={{ minHeight: '400px' }}>
          <h3 className="font-semibold mb-4">Nakit Akış Trendi</h3>
          <div className="h-full flex items-center justify-center border-t border-dashed" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-muted">Grafik Alanı (Recharts veya Chart.js eklenebilir)</p>
          </div>
        </div>
        <div className="card" style={{ width: '350px' }}>
          <h3 className="font-semibold mb-4">Risk Skorları Yüksek Olanlar</h3>
          <ul className="flex flex-col gap-4">
             {/* Dummy list */}
             <li className="flex justify-between items-center p-3" style={{ backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p className="font-semibold text-sm">IronClad Industries</p>
                  <p className="text-xs text-muted">TX-4492-613</p>
                </div>
                <span className="badge badge-danger">Yüksek Risk</span>
             </li>
             <li className="flex justify-between items-center p-3" style={{ backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p className="font-semibold text-sm">Vertex Logistics</p>
                  <p className="text-xs text-muted">TX-1349-207</p>
                </div>
                <span className="badge badge-warning">İzlenmeli</span>
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
