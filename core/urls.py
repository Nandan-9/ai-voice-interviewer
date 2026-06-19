from django.urls import path

from .views.start_interview import StartInterviewView
from .views.respond_interview import RespondInterviewView
from .views.analyze_interview import AnalyzeInterviewView

urlpatterns = [
    path('interview/start/',   StartInterviewView.as_view(),   name='start-interview'),
    path('interview/respond/', RespondInterviewView.as_view(), name='respond-interview'),
    path('interview/analyze/', AnalyzeInterviewView.as_view(), name='analyze-interview'),
]
