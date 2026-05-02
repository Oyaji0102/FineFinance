# FineFinance Backend - AI Financial Analysis Platform

FineFinance is an advanced SaaS backend designed to automate financial analysis using AI. This platform processes financial documents via OCR, generates detailed financial health scores, produces AI-driven insights, and automatically creates professional PowerPoint (.pptx) presentations for holding companies and SMEs.

## 🚀 Features

### Core Capabilities (MVP)
- **Role-Based Access Control (RBAC):** Distinct roles for standard users and Admin.
- **Firm Management (CRUD):** Add, update, and manage company financial records.
- **AI-Powered OCR:** Extract text from uploaded financial documents (Invoices, Receipts, Balance Sheets) using Tesseract.
- **LLM Financial Analysis:** Uses Google Gemini to generate strengths, weaknesses, and synergy potentials from raw financial data.
- **Automated PPTX Generation:** Creates a fully structured 5-slide PowerPoint presentation with financial charts, tables, and AI insights.
- **Premium Subscription Flow:** Users can request premium packages, and admins can approve them to unlock advanced AI features.
- **Advanced Logging:** Database-level logging for all critical system actions.

### Bonus / Advanced Features (Nice-to-Have)
- **O4: Financial Score Calculation:** Automatically calculates a risk/health score (0-100) based on liquidity, profitability, and leverage ratios.
- **O6: Data Export:** Download the entire list of companies and their financial status in `.csv` / Excel format.
- **O1: Consolidated Reports:** Select multiple firms (Holding structure) and generate a combined financial overview.
- **O7: Real-Time Notifications:** WebSocket integration for instant alerts when premium requests are approved or AI tasks complete.
- **OWASP Top 10 Security:** Hardened against SQL Injection (SQLAlchemy), Broken Access Control (JWT/RBAC), and XSS.

## 🛠️ Tech Stack
- **Framework:** FastAPI (Python 3)
- **Database:** SQLite (Async) with SQLAlchemy ORM
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt hashing
- **AI/LLM:** Google Generative AI (Gemini)
- **OCR:** Pytesseract & Pillow
- **File Processing:** Python-pptx, CSV
- **Real-time:** WebSockets

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Oyaji0102/FineFinance.git
   cd FineFinance/backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create a `.env` file in the `backend` directory and add:
   ```env
   SECRET_KEY=your_super_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Run the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

6. **API Documentation:**
   Open your browser and navigate to `http://127.0.0.1:8000/docs` to view the interactive Swagger UI.

## 🛡️ Security Testing
Run the comprehensive end-to-end security suite:
```bash
python run_owasp_tests.py
```