import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

_MIME_TYPES = {
    '.webm': 'audio/webm',
    '.mp3':  'audio/mpeg',
    '.wav':  'audio/wav',
    '.ogg':  'audio/ogg',
    '.m4a':  'audio/mp4',
}


def transcribe_audio(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    mime_type = _MIME_TYPES.get(ext, 'audio/webm')

    with open(file_path, 'rb') as f:
        uploaded = _client.files.upload(
            file=f,
            config={"mime_type": mime_type, "display_name": os.path.basename(file_path)},
        )

    response = _client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            uploaded,
            "Transcribe the speech in this audio exactly as spoken. Return only the transcription text, no commentary or formatting.",
        ],
    )

    _client.files.delete(name=uploaded.name)

    return response.text.strip()
