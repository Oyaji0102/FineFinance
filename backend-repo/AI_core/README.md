# AI Core Modülü (Yapay Zeka Katmanı)

Bu klasör, projenin **Smart Inspection with AI** hedeflerini gerçekleştirmek için kurulmuş izole Yapay Zeka (AI) katmanıdır. Backend ekibinin kodlarıyla tamamen entegredir.

## 🚀 Ne Yapıldı?

Hackathon kılavuzundaki gereksinimlere göre (T3, T4, T5, T7) aşağıdaki tüm isterler **eksiksiz** kodlanmıştır:
1. **Belge Okuma (OCR + LLM):** Vergi levhası veya bilanço görsellerini okuyup JSON form verisi çıkarma.
2. **Finansal Analiz:** Ham rakamlardan yola çıkarak "Güçlü Yönler, Zayıf Yönler, Riskler ve Uzman Önerileri" çıkarma.
3. **Ön Sunum Özeti:** Oluşturulan .pptx dosyasına eklenmek üzere 3-4 cümlelik vurucu yapay zeka özeti çıkarma.
4. **Demo/Mock Data:** Jüriye sunum yaparken veritabanını doldurmak için sahte (ama çok gerçekçi) firma ve finans verisi üretme scripti.

---

## 🔑 Nasıl Çalışır? (Backend Ekibi İçin)

Backend sistemi API endpointleri tetiklendiğinde arka planda doğrudan bu klasördeki modülleri çağırır.
Özel bir API sunucusuna ihtiyaç yoktur, tüm AI fonksiyonları bir **Python Kütüphanesi** gibi backendin içine yedirilmiştir.

### Ekstra Gereksinimler (Mutlaka Yapılması Gereken)
Projenin çalıştığı ortamda (lokal bilgisayarınızda veya sunucuda) mutlaka **OpenAI API Key** tanımlanmış olmalıdır.
`.env` dosyanızın içine şunu ekleyin:

```env
OPENAI_API_KEY=sk-proj-SizinGercekOpenAI_KeyinizBurayaGelecek
```

Ana dizinde terminale `pip install openai` yazarak kütüphaneyi kurmayı unutmayın (Eğer requirements'da yoksa).

---

## 🧠 AI Prompt Stratejimiz (Hackathon Ekstra Puan Kriteri)

Sistemimiz `gpt-4o` modelini ve OpenAI'ın **Structured Output (JSON Mode)** yeteneğini kullanmaktadır. Bu sayede yapay zekanın "halüsinasyon" görüp formata uymayan rastgele metinler üretmesi kesin olarak engellenmiştir. 

Prompt stratejimiz 3 ayağa ayrılmıştır (Detaylar `prompts.py` içindedir):

1. **Document Extraction (Belge Çıkarımı):** 
   - *Model:* `gpt-4o` (Vision)
   - *Strateji:* Görsel, base64 formatında gönderilir. Sisteme "Sen bir finansal veri giriş asistanısın, sadece sana verilen JSON anahtarlarına karşılık gelen verileri resimden bul, bulamadığına null dön" denilir. Temperature `0.1` tutularak kesinlik (determinism) maksimize edilmiştir.
2. **Financial Analyst (Finansal Analiz & Premium):**
   - *Model:* `gpt-4o`
   - *Strateji:* Ham bilanço/hesap verileri JSON string olarak prompta yedirilir. Sisteme "Sen kıdemli bir Finansal Strateji Danışmanısın" rolü biçilir. Eğer kullanıcı "Premium" değilse yüzeysel bir analiz istenir; kullanıcı Premium ise Prompt dinamik olarak güncellenir ve derin, makroekonomik, yatırım danışmanlığı seviyesinde Markdown analiz metni istenir.
3. **Mock Data Generation (Sahte Veri):**
   - *Model:* `gpt-4o`
   - *Strateji:* "Jüri sunumu için tutarlı sektör verisi üret" mantığıyla çalışır. Temperature `0.7` tutularak her çalıştırıldığında birbirinden yaratıcı ve farklı sektör profilleri (isimler, borç oranları) üretmesi hedeflenmiştir.
