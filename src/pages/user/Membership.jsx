import React, { useState, useEffect } from 'react';
import { Crown, Check, X, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export default function Membership() {
  const [plans, setPlans] = useState(null);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      setLoading(true);
      const [plansData, membershipData] = await Promise.all([
        api.getMembershipPlans(),
        api.getUserMembership()
      ]);
      setPlans(plansData);
      setCurrentMembership(membershipData);
    } catch (error) {
      console.error('Error loading membership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType) => {
    try {
      setUpgrading(true);
      setMessage('');
      
      await api.upgradeMembership(planType, billingPeriod);
      
      // Reload membership data
      const membershipData = await api.getUserMembership();
      setCurrentMembership(membershipData);
      
      setMessage(`✓ ${planType.toUpperCase()} planına başarıyla yükseltildiniz!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Güncelleme başarısız: ' + error.message);
    } finally {
      setUpgrading(false);
    }
  };

  const handleDowngrade = async () => {
    if (!confirm('Free plana geçmek istediğinize emin misiniz? Premium özelliklerinizi kaybedeceksiniz.')) return;

    try {
      setUpgrading(true);
      setMessage('');
      
      await api.downgradeMembership();
      
      const membershipData = await api.getUserMembership();
      setCurrentMembership(membershipData);
      
      setMessage('✓ Free plana başarıyla indirildiniz!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ İşlem başarısız: ' + error.message);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        Yükleniyor...
      </div>
    );
  }

  if (!plans || !currentMembership) {
    return (
      <div style={{ padding: '2rem', color: '#dc2626' }}>
        Üyelik bilgileri yüklenemedi.
      </div>
    );
  }

  const currentPlan = plans.plans[currentMembership.plan_type];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Crown size={32} color='#facc15' />
          Üyelik Yönetimi
        </h1>
        <p style={{ color: '#64748b' }}>Mevcut plan ve özellikleri yönetin, yükseltme yapın</p>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          backgroundColor: message.includes('✓') ? '#dcfce7' : '#fee2e2',
          color: message.includes('✓') ? '#166534' : '#991b1b',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {message}
        </div>
      )}

      {/* Current Plan Info */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '2px solid #0284c7',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <p style={{ color: '#0c4a6e', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          MOVCUTüyelik Planı
        </p>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase' }}>
          {currentPlan.name}
        </h2>
        <p style={{ color: '#475569', marginBottom: '1rem' }}>
          {currentPlan.description}
        </p>
        
        {currentMembership.expires_at && (
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Bitiş Tarihi: <strong>{new Date(currentMembership.expires_at).toLocaleDateString('tr-TR')}</strong>
          </p>
        )}
      </div>

      {/* Billing Period Toggle */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Faturalandırma Dönemi:</label>
        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
          {['monthly', 'annual'].map((period) => (
            <button
              key={period}
              onClick={() => setBillingPeriod(period)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: billingPeriod === period ? '#0e7490' : 'transparent',
                color: billingPeriod === period ? '#ffffff' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              {period === 'monthly' ? 'Aylık' : 'Yıllık'}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {['free', 'basic', 'premium'].map((planType) => {
          const plan = plans.plans[planType];
          const isCurrentPlan = currentMembership.plan_type === planType;
          const price = billingPeriod === 'monthly' ? plan.monthly_price : plan.annual_price;
          const savings = billingPeriod === 'annual' ? Math.round((plan.monthly_price * 12 - plan.annual_price) / (plan.monthly_price * 12) * 100) : 0;

          return (
            <div
              key={planType}
              style={{
                backgroundColor: isCurrentPlan ? '#eff6ff' : '#ffffff',
                border: isCurrentPlan ? '2px solid #0284c7' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isCurrentPlan) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrentPlan) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isCurrentPlan && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Mevcut Plan
                </div>
              )}

              {savings > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '1rem',
                  backgroundColor: '#facc15',
                  color: '#000000',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {savings}% Tasarruf
                </div>
              )}

              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem', marginTop: isCurrentPlan && !savings > 0 ? '0.5rem' : 0 }}>
                {plan.name}
              </h3>
              
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.25rem' }}>
                  {price === 0 ? '₺0' : `₺${price.toLocaleString('tr-TR')}`}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  {price === 0 ? 'Ücretsiz' : billingPeriod === 'monthly' ? '/ay' : '/yıl'}
                </p>
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.875rem' }}>
                    <Check size={16} color='#16a34a' />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              {isCurrentPlan ? (
                <button disabled style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#e2e8f0',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'not-allowed'
                }}>
                  Mevcut Plan
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleUpgrade(planType)}
                    disabled={upgrading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#0e7490',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: upgrading ? 'not-allowed' : 'pointer',
                      opacity: upgrading ? 0.5 : 1,
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {upgrading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                    {planType === 'free' ? 'İndir' : 'Yükselt'}
                  </button>
                  {currentMembership.plan_type !== 'free' && planType === 'free' && (
                    <button
                      onClick={handleDowngrade}
                      disabled={upgrading}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #dc2626',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: upgrading ? 'not-allowed' : 'pointer',
                        opacity: upgrading ? 0.5 : 1
                      }}
                    >
                      {upgrading ? 'İşleniyor...' : 'İndir'}
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
