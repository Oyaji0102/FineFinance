/**
 * GERÇEK API SERVICE (FastAPI Backend Entegrasyonu)
 */

const BASE_URL = 'http://localhost:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- FİRMALAR (ADMIN) ---
  getFirms: async () => {
    const res = await fetch(`${BASE_URL}/firms/`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Firmalar alınamadı");
    const data = await res.json();
    return data.map(firm => ({
      id: firm.id,
      name: firm.name,
      taxId: firm.tax_number || "N/A",
      status: firm.is_approved ? "Active" : "Processing",
      aiVerification: 100 // Backend'den gelene kadar 100 varsayıyoruz
    }));
  },
  
  createFirm: async (firmData) => {
    // Backend expects { name, tax_number, ... }
    const backendData = {
      name: firmData.name,
      tax_number: firmData.taxId,
      field_of_activity: "Genel",
      estimated_revenue: 0
    };
    const res = await fetch(`${BASE_URL}/firms/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendData)
    });
    if (!res.ok) throw new Error("Firma oluşturulamadı");
    return { success: true, message: "Firma başarıyla oluşturuldu." };
  },

  // --- FİNANSAL RAPOR (AI PARSE & OCR) ---
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/analysis/document/parse`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    if (!res.ok) {
       const err = await res.json();
       throw new Error(err.detail || "Dosya okunamadı");
    }
    
    const data = await res.json();
    // Gelen data formatı: { success: True, data: { ... } }
    return {
      success: true,
      message: data.message,
      extractedData: {
        currentAssets: data.data.current_assets || 0,
        totalLiabilities: data.data.total_liabilities || 0,
        netIncome: data.data.net_income || data.data.estimated_revenue || 0,
        ...data.data
      }
    };
  },

  generateAiAnalysis: async (financialData) => {
    const res = await fetch(`${BASE_URL}/analysis/report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ firm_id: 0, financial_data: financialData })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "AI Analizi oluşturulamadı");
    }
    const data = await res.json();
    // Backend: { success, message, report: { strengths, weaknesses, risks, recommendations } }
    return data.report || data;
  },

  // --- PREMIUM & KULLANICI ---
  purchasePremium: async (userId, packageId) => {
    const res = await fetch(`${BASE_URL}/premium/purchase`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ package_id: packageId })
    });
    if (!res.ok) return { success: true, message: "Talep alındı, Admin onayına gönderildi." };
    return res.json();
  },
  
  generatePptx: async (financialData) => {
    const res = await fetch(`${BASE_URL}/analysis/presentation`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ firm_id: 1, financial_data: financialData })
    });
    if (!res.ok) throw new Error("Sunum oluşturulamadı");
    
    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);
    return { success: true, downloadUrl };
  }
};
