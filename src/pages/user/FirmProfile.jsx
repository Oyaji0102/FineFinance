import React, { useState } from 'react';
import { Save, AlertCircle, Building, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function FirmProfile() {
  const { user } = useAuth();
  const [status, setStatus] = useState('pending'); // idle, pending, approved
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Firma Bilgileri</h1>
          <p className="text-muted">Profil bilgilerinizi yönetin. Güncellemeler Admin onayından sonra yayına alınır.</p>
        </div>
      </div>

      {status === 'pending' && (
        <div className="p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)' }}>
          <AlertCircle className="text-warning mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-warning">Onay Bekleyen Güncellemeniz Var</h3>
            <p className="text-sm text-secondary mt-1">Yaptığınız son bilgi güncellemeleri şu an yönetici onayında. Onaylandıktan sonra sistemde aktif olacaktır.</p>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex flex-col gap-6" style={{ flex: 2 }}>
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Building size={20} /> Temel Bilgiler
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-secondary mb-1 block">Firma Ünvanı</label>
                  <input type="text" className="input-base" defaultValue="TechCorp Yazılım A.Ş." />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-secondary mb-1 block">Vergi Kimlik No (VKN)</label>
                  <input type="text" className="input-base" defaultValue="1234567890" disabled style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                  <p className="text-xs text-muted mt-1">VKN değiştirmek için desteğe başvurun.</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-secondary mb-1 block">Sektör</label>
                <select className="input-base">
                  <option>Bilişim & Yazılım</option>
                  <option>Finans</option>
                  <option>E-Ticaret</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-secondary mb-1 block flex items-center gap-1">
                  <MapPin size={16} /> Merkez Adresi
                </label>
                <textarea className="input-base" rows="3" defaultValue="Maslak Mah. Büyükdere Cad. No:123 Şişli/İstanbul"></textarea>
              </div>

              <div className="flex justify-end mt-4">
                <button className="btn btn-primary">
                  <Save size={18} />
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6" style={{ flex: 1 }}>
          <div className="card text-center flex flex-col items-center">
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '2px solid var(--brand-primary)' }}>
                <span className="text-2xl font-bold text-brand-primary">TC</span>
             </div>
             <h3 className="font-bold text-lg">TechCorp Yazılım A.Ş.</h3>
             <p className="text-muted text-sm mb-4">Sistem ID: #{user?.firmId || '101'}</p>
             
             <div className="w-full text-left p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <p className="text-sm font-semibold text-secondary mb-2">Yetkili Kullanıcı</p>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted">admin@techcorp.com</p>
             </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Abonelik Durumu</h3>
            <div className="flex items-center gap-2 mb-2">
               <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Standart Paket</span>
               <span className="badge badge-success"><CheckCircle2 size={12} className="mr-1"/> Aktif</span>
            </div>
            <p className="text-sm text-muted">Yapay zeka özellikleri ve kapsamlı raporlar için premium pakete geçiş yapın.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
