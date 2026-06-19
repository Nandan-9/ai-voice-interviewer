import os
import sys
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY", "").strip()
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env")
    sys.exit(1)

try:
    from google import genai
except ImportError:
    print("ERROR: google-genai not installed. Run: uv add google-genai")
    sys.exit(1)

client = genai.Client(api_key=api_key)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Say 'API key is active' and nothing else.",
)
print(response.text.strip())
