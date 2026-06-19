from django.http import JsonResponse
from django.views import View
from .models import Company, Role


class CompanyListView(View):
    def get(self, request):
        companies = list(Company.objects.values("id", "name"))
        return JsonResponse(companies, safe=False)


class CompanyRolesView(View):
    def get(self, request, company_id):
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return JsonResponse({"error": "Company not found"}, status=404)

        roles = list(
            company.roles.values("id", "title", "category", "difficulty", "experience", "duration_mins")
        )
        return JsonResponse({"company": company.name, "roles": roles})


class RoleDetailView(View):
    def get(self, request, company_id, role_id):
        try:
            role = Role.objects.select_related("company").get(id=role_id, company_id=company_id)
        except Role.DoesNotExist:
            return JsonResponse({"error": "Role not found"}, status=404)

        return JsonResponse({
            "id": role.id,
            "company": role.company.name,
            "title": role.title,
            "category": role.category,
            "difficulty": role.difficulty,
            "experience": role.experience,
            "interview_type": role.interview_type,
            "duration_mins": role.duration_mins,
            "about_role": role.about_role,
            "skills": role.skills,
            "interview_structure": role.interview_structure,
            "what_to_expect": role.what_to_expect,
        })
