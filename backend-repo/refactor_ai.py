import os
import glob

# 1. AI_core içerisindeki OpenAI kodlarını Gemini OpenAI endpoint'ine yönlendiriyoruz
for filepath in glob.glob("AI_core/*.py"):
    with open(filepath, "r") as f:
        content = f.read()
    
    # API key ve Base URL değişimi
    content = content.replace(
        'api_key=os.getenv("OPENAI_API_KEY")', 
        'api_key=os.getenv("GEMINI_API_KEY"), base_url="https://generativelanguage.googleapis.com/v1beta/openai/"'
    )
    # Model değişimi (gpt-4o yerine gemini-1.5-flash)
    content = content.replace('"gpt-4o"', '"gemini-1.5-flash"')
    
    with open(filepath, "w") as f:
        f.write(content)

print("AI_core başarıyla Gemini'ye uyarlandı!")
