from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser

from django.shortcuts import get_object_or_404

from google.genai.errors import ClientError

from core.models import Interview, InterviewResponse
from core.services.transcription_service import transcribe_audio


class RespondInterviewView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        interview_id = request.data.get("interview_id")
        question_id = request.data.get("question_id")
        audio = request.FILES.get("audio")

        if not interview_id or not question_id or not audio:
            return Response(
                {"error": "interview_id, question_id, and audio are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview = get_object_or_404(Interview, id=interview_id)

        # Replace any existing response for this question
        InterviewResponse.objects.filter(
            interview=interview, question_id=question_id
        ).delete()

        interview_response = InterviewResponse.objects.create(
            interview=interview,
            question_id=int(question_id),
            audio_file=audio,
        )

        try:
            transcript = transcribe_audio(interview_response.audio_file.path)
        except ClientError as e:
            interview_response.delete()
            if e.status_code == 429:
                return Response(
                    {"error": "Transcription quota exceeded. Please wait a moment and try again."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )
            return Response(
                {"error": "Transcription failed. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        interview_response.transcript = transcript
        interview_response.save()

        return Response(
            {"question_id": int(question_id), "transcript": transcript},
            status=status.HTTP_201_CREATED,
        )
