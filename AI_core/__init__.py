# AI_core module exports
# .env dosyasını yükle (GEMINI_API_KEY için)
import os
from pathlib import Path
try:
    from dotenv import load_dotenv
    _env_path = Path(__file__).parent.parent / "backend" / ".env"
    load_dotenv(dotenv_path=_env_path)
except ImportError:
    pass  # python-dotenv yoksa ortam değişkenlerinden alır

from .extractor import parse_firm_document, parse_firm_text
from .analyzer import generate_financial_analysis, generate_pptx_summary, generate_consolidated_analysis
from .mock_generator import generate_mock_firm

__all__ = [
    "parse_firm_document",
    "parse_firm_text",
    "generate_financial_analysis",
    "generate_pptx_summary",
    "generate_consolidated_analysis",
    "generate_mock_firm"
]
