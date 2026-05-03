import asyncio, os, sys, json
sys.path.append(os.path.abspath('..'))
os.environ['GEMINI_API_KEY'] = 'AIzaSyB6IVK3TwagM3iMMvgw6M2nsbb8oqL-Lno'

from AI_core.extractor import parse_firm_document

FINDEKS = 'C:\\Users\\Arslan\\Desktop\\konu-2\\konu-2\\kullan\u0131labilir ekler\\findeksRapor_30042026.pdf'

async def main():
    print('=== Findeks PDF Test ===')
    print('Dosya var mi:', os.path.exists(FINDEKS))
    result = await parse_firm_document(FINDEKS, 'application/pdf')
    print(json.dumps(result, ensure_ascii=False, indent=2))

asyncio.run(main())
