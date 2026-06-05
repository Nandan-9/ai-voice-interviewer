
from django.urls import path

from .views.start_interview import StartInterviewView
from .views.analyze_interview import AnalyzeInterviewView

urlpatterns = [
    path('interview/start/', StartInterviewView.as_view(), name='start-interview'),
    path('interview/analyze/', AnalyzeInterviewView.as_view(), name='analyze-interview'),
]