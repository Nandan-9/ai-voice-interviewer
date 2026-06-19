from django.contrib import admin
from .models import Company, Role, QuestionBank


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "company", "category", "difficulty", "experience", "duration_mins")
    list_filter = ("company", "category", "difficulty", "interview_type")
    search_fields = ("title", "company__name")


@admin.register(QuestionBank)
class QuestionBankAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "role", "category", "difficulty")
    list_filter = ("category", "difficulty", "role__company")
    search_fields = ("question", "role__title", "role__company__name")
