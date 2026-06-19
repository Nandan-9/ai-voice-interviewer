from django.contrib import admin
from .models import Interview, InterviewResponse


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "company", "role", "status", "created_at")
    list_filter = ("status", "company")
    search_fields = ("company", "role", "user__email")


@admin.register(InterviewResponse)
class InterviewResponseAdmin(admin.ModelAdmin):
    list_display = ("id", "interview", "question_id", "created_at")
    search_fields = ("interview__role",)
