from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from core.models import Interview
from core.services.analyze_service import analyze_interview


class AnalyzeInterviewView(APIView):
    def post(self, request):
        interview_id = request.data.get("interview_id")

        if not interview_id:
            return Response(
                {"error": "interview_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview = get_object_or_404(Interview, id=interview_id)

        responses = [
            {"question_id": r.question_id, "response_text": r.transcript}
            for r in interview.responses.all()
        ]

        if not responses:
            return Response(
                {"error": "No responses submitted for this interview yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = analyze_interview(interview.questions, responses)

        interview.status = 'completed'
        interview.save()

        return Response(result, status=status.HTTP_200_OK)
