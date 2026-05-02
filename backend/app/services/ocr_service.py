import pytesseract
from PIL import Image
import io

async def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Yüklenen görselden (bytes) OCR ile metin çıkarır.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        # Türkçe ve İngilizce dil paketi ile OCR yapalım (Çok dilli destek)
        text = pytesseract.image_to_string(image, lang='tur+eng')
        return text
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
