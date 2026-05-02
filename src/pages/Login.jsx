import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, User as UserIcon, ArrowRight, Activity, CheckCircle2, FileText, Lock, LayoutDashboard, Database } from 'lucide-react';

const landingStyles = `
  .nav-tab {
    color: #cbd5e1;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
  }
  .nav-tab:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  .nav-tab:active {
    transform: translateY(1px);
    box-shadow: none;
  }
  .nav-tab.active {
    color: #ffffff;
    background-color: rgba(14, 165, 233, 0.15);
  }
  .nav-btn {
    background: transparent;
    border: none;
    color: #ffffff;
    font-weight: 500;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  .nav-btn:hover {
    transform: scale(1.05);
    text-shadow: 0 0 8px rgba(255,255,255,0.5);
  }
  .nav-btn-solid {
    background-color: #ffffff;
    color: #0f172a;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .nav-btn-solid:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255,255,255,0.2);
  }
`;

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <style>{landingStyles}</style>
    <div style={{ backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Header & Hero Section (Dark) */}
      <div style={{ backgroundColor: '#0b1120', color: '#ffffff', paddingBottom: '6rem' }}>
        
        {/* Navbar */}
        <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--brand-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>FineFin.AI</span>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
            <a href="#solutions" className="nav-tab active">Solutions</a>
            <a href="#technology" className="nav-tab">Technology</a>
            <a href="#compliance" className="nav-tab">Compliance</a>
            <a href="#pricing" className="nav-tab">Pricing</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setShowLoginModal(true)} className="nav-btn">Login</button>
            <button onClick={() => setShowLoginModal(true)} className="nav-btn-solid">Get Started</button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container" style={{ display: 'flex', alignItems: 'center', marginTop: '4rem', gap: '4rem' }}>
          {/* Left Text */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--brand-primary)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '1.5rem', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              NEW V2.0 PLATFORM
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Precision <br/>Financial Auditing<br/>
              <span style={{ color: 'var(--brand-primary)' }}>Powered by AI.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: '1.6' }}>
              Unlock insights that human eyes miss. Automate high-stakes inspections with OCR smart parsing and real-time investment tracking engineered for modern consultancy firms.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowLoginModal(true)} style={{ backgroundColor: 'var(--brand-primary)', color: '#ffffff', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)' }}>
                Run Smart Inspection <ArrowRight size={18} />
              </button>
              <button onClick={() => setShowLoginModal(true)} style={{ backgroundColor: 'transparent', color: '#ffffff', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                View Demo
              </button>
            </div>
          </div>

          {/* Right Graphic */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(11,17,32,0) 70%)', pointerEvents: 'none' }}></div>
            <div style={{ backgroundColor: '#1e293b', padding: '0.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 10 }}>
               {/* Real Dashboard UI Image */}
               <img src="/hero-dashboard.png" alt="Finansal Dashboard Arayüzü" style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }} />
            </div>
            {/* Floating Badge */}
            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', backgroundColor: '#ffffff', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 20, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Activity color="var(--brand-primary)" size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence Score</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>99.8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Panel Architecture Section */}
      <div id="solutions" className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' }}>The Dual-Panel Architecture</h2>
        <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '700px', margin: '0 auto 4rem' }}>Engineered to balance high-level systemic oversight with focused, task-based operations seamlessly.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
          {/* Admin Panel Card */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
               <div style={{ backgroundColor: '#1e293b', padding: '0.5rem', borderRadius: '8px' }}><LayoutDashboard color="white" size={20} /></div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Oversight Panel</h3>
            </div>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '2rem' }}>Complete control over the auditing ecosystem. Monitor system health, manage client submissions, and ensure absolute accuracy through detailed audit logs and performance metrics.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#334155', fontWeight: '500' }}>
               <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--brand-primary)" /> System-wide Dashboards</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--brand-primary)" /> AI Reliability Tuning</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--brand-primary)" /> Global Compliance Monitoring</li>
            </ul>
          </div>

          {/* User Portal Card */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
               <div style={{ backgroundColor: 'var(--brand-primary)', padding: '0.5rem', borderRadius: '8px' }}><UserIcon color="white" size={20} /></div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Professional User Portal</h3>
            </div>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '2rem' }}>Dedicated task-focused environment for individual auditors and consultants. Streamlined uploads, real-time AI feedback, and collaborative reporting tools.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#334155', fontWeight: '500' }}>
               <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--brand-primary)" /> Task-Centric Navigation</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--brand-primary)" /> Smart OCR Document Upload</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--brand-primary)" /> One-Click PPTX Generation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* High-End Features Grid */}
      <div id="technology" className="container" style={{ padding: '4rem 0 6rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' }}>High-End Features for Financial Precision.</h2>
        <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '700px', marginBottom: '4rem' }}>Our suite of tools uses proprietary machine learning models trained on millions of financial datasets.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
           <div style={{ gridColumn: 'span 2', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--brand-primary)', backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '99px', marginBottom: '1rem', display: 'inline-block' }}>EXCLUSIVE AI</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>OCR & AI Extraction Engine</h3>
              <p style={{ color: '#64748b', maxWidth: '400px' }}>Automatically convert unstructured documents into structured, queryable data with 99.8% accuracy across multiple languages and financial formats.</p>
           </div>
           
           <div style={{ backgroundColor: '#0f172a', color: 'white', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ backgroundColor: 'var(--brand-primary)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FileText size={20} color="white" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>AI Analysis Summaries</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Get instant summaries of complex audit findings, identifying anomalies and potential automated insights in natural language.</p>
           </div>

           <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem' }}>
              <div style={{ backgroundColor: '#f1f5f9', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Activity size={20} color="#475569" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>Responsive Performance</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Ultra-fast data querying capabilities. Scale large audits without bottlenecks or UI responsiveness issues.</p>
           </div>

           <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem' }}>
              <div style={{ backgroundColor: '#f1f5f9', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Database size={20} color="#475569" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>Real-time Tracking</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Live dashboards monitoring investment flows and the overall financial health score.</p>
           </div>

           <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem' }}>
              <div style={{ backgroundColor: '#f1f5f9', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Lock size={20} color="#475569" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>Enterprise Security</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Bank-grade encryption and SOC2 compliance ensure your financial data remains strictly private.</p>
           </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div id="pricing" className="container" style={{ paddingBottom: '6rem' }}>
         <div style={{ backgroundColor: '#0b1120', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(11,17,32,0) 60%)', pointerEvents: 'none' }}></div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>Ready to scale your inspection precision?</h2>
            <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2.5rem', position: 'relative', zIndex: 10 }}>Join top-tier consultancy firms and financial institutions leveraging AI On-Core for their audit transformations.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
              <button onClick={() => setShowLoginModal(true)} style={{ backgroundColor: 'var(--brand-primary)', color: '#ffffff', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer' }}>
                Get Started
              </button>
              <button onClick={() => setShowLoginModal(true)} style={{ backgroundColor: 'transparent', color: '#ffffff', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                Login to System
              </button>
            </div>
         </div>
      </div>

      {/* Login Modal Overlay */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(11, 17, 32, 0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '400px', backgroundColor: '#ffffff', color: '#0f172a', position: 'relative', animation: 'fadeInUp 0.3s ease-out forwards' }}>
            <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--brand-primary)', borderRadius: '12px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert color="white" size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Sisteme Giriş Yapın</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>Hesap bilgilerinizi giriniz.</p>
            </div>
            
            {errorMsg && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#475569' }}>E-posta Adresi</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ornek@finefin.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#475569' }}>Şifre</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'var(--brand-primary)', color: 'white', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} <ArrowRight size={18} />
              </button>
            </form>
            
            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
              Test Admin: admin@finefin.com / password<br/>
              Test User: user@client.com / password
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
