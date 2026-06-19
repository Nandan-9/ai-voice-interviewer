from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import UserRegistrationSerializer


class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {"message": "Login successful", "username": user.username, "email": user.email},
            status=status.HTTP_200_OK,
        )
