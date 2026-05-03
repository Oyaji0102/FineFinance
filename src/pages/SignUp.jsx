import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Mail, Lock, User as UserIcon, Check, X, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Register, 2: Choose Plan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Register form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Plan selection
  const [plans, setPlans] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      
      // Register
      const registerRes = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password
        })
      });

      if (!registerRes.ok) {
        const err = await registerRes.json();
        throw new Error(err.detail || 'Kayıt başarısız oldu');
      }

      // Login
      const user = await login(email, password);
      
      // Fetch plans
      const plansData = await api.getMembershipPlans();
      setPlans(plansData);
      
      setStep(2);
      setSuccess('Başarıyla kayıt oldunuz! Şimdi bir plan seçin.');
    } catch (err) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async () => {
    try {
      setLoading(true);
      
      if (selectedPlan !== 'free') {
        await api.upgradeMembership(selectedPlan, billingPeriod);
        setSuccess(`${selectedPlan} plana başarıyla yükseltildiniz!`);
      }
      
      setTimeout(() => {
        navigate('/user');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Plan seçimi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (planType) => {
    const colors = {
      free: { bg: '#f8fafc', border: '#cbd5e1', text: '#475569' },
      basic: { bg: '#eff6ff', border: '#0284c7', text: '#0c4a6e' },
      premium: { bg: '#fefce8', border: '#facc15', text: '#713f12' }
    };
    return colors[planType] || colors.free;
  };

  const getPlanDetails = (planType) => {
    const details = {
      free: {
        name: 'Free',
        price: '₺0',
        description: 'Temel özellikler',
        features: ['Firma analizi', 'PDF rapor oluştur', 'Temel AI analiz']
      },
      basic: {
        name: 'Basic',
        price: '₺99/ay',
        description: 'Gelişmiş özellikler',
        features: ['Tüm Free özellikler', 'Gelişmiş AI Analiz', 'Otomatik OCR', 'Sunum (PPT)', 'Öncelikli destek']
      },
      premium: {
        name: 'Premium',
        price: '₺299/ay',
        description: 'Kurumsal çözüm',
        features: ['Tüm Basic özellikler', 'API Erişimi', 'Yönetici desteği', 'Kurumsal raporlama', 'Veri dışa aktarma']
      }
    };
    return details[planType] || details.free;
  };

  if (step === 1) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <ShieldAlert size={32} color='#0e7490' />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>FineFin.AI</h1>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
            Hesap Oluştur
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Finansal analizlerinize başlayın
          </p>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <X size={16} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                Ad Soyad
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Adınız Soyadınız"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                Şifre Tekrar
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#0e7490',
                color: '#ffffff',
                padding: '0.75rem',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                marginTop: '0.5rem'
              }}
            >
              {loading ? 'Yükleniyor...' : 'Hesap Oluştur'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
            Zaten hesabınız var mı?{' '}
            <a href="/" style={{ color: '#0e7490', textDecoration: 'none', fontWeight: '600' }}>
              Giriş Yapın
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2 && plans) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
              Bir Plan Seçin
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
              İhtiyacınıza en uygun planı seçerek ilerleyin
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {['free', 'basic', 'premium'].map((plan) => {
              const details = getPlanDetails(plan);
              const colors = getPlanColor(plan);
              const isSelected = selectedPlan === plan;

              return (
                <div
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  style={{
                    backgroundColor: colors.bg,
                    border: `2px solid ${isSelected ? colors.border : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.text }}>
                      {details.name}
                    </h3>
                    {isSelected && (
                      <Check size={24} color={colors.text} />
                    )}
                  </div>

                  <p style={{ color: colors.text, fontSize: '0.875rem', marginBottom: '1rem', opacity: 0.8 }}>
                    {details.description}
                  </p>

                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.text, marginBottom: '1.5rem' }}>
                    {details.price}
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                    {details.features.map((feature, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: colors.text }}>
                        <Check size={16} />
                        <span style={{ fontSize: '0.875rem' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSelectPlan}
              disabled={loading}
              style={{
                backgroundColor: '#0e7490',
                color: '#ffffff',
                padding: '1rem 2rem',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Yükleniyor...' : (
                <>
                  Devam Et <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div>Yükleniyor...</div>;
}
