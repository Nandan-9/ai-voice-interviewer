from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from core.services.analyze_service import analyze_interview


class AnalyzeInterviewView(APIView):
    def post(self, request):
        questions = request.data.get("questions")
        responses = request.data.get("responses")

        if not questions or not responses:
            return Response(
                {"error": "questions and responses are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = analyze_interview(questions, responses)
        return Response(result, status=status.HTTP_200_OK)
