from django.conf import settings
from django.db import models


class Interview(models.Model):
    STATUS_CHOICES = [('active', 'Active'), ('completed', 'Completed')]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    company = models.CharField(max_length=200, blank=True)
    role = models.CharField(max_length=200)
    questions = models.JSONField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)


class InterviewResponse(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='responses')
    question_id = models.IntegerField()
    audio_file = models.FileField(upload_to='interview_audio/%Y/%m/%d/')
    transcript = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('interview', 'question_id')
