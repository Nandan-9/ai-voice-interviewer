
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..services import interview_service


class StartInterviewView(APIView):

    def post(self, request):
        company = request.data.get("company")
        role = request.data.get("role")

        if not role:
            return Response({"error": "role is required"}, status=status.HTTP_400_BAD_REQUEST)

        result = interview_service.generate_interview(company=company, role=role)

        if "error" in result:
            return Response(result, status=status.HTTP_404_NOT_FOUND)

        return Response(result, status=status.HTTP_200_OK)