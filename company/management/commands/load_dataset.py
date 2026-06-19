import json
import os

from django.core.management.base import BaseCommand

from company.models import Company, Role


class Command(BaseCommand):
    help = "Load companies and roles from company_data.json"

    def handle(self, *args, **options):
        from django.conf import settings
        dataset_path = os.path.join(settings.BASE_DIR, "company_data.json")

        with open(dataset_path) as f:
            data = json.load(f)

        company_cache = {}
        created_companies = 0
        created_roles = 0

        for item in data:
            company_name = item["company"]

            if company_name not in company_cache:
                company, created = Company.objects.get_or_create(name=company_name)
                company_cache[company_name] = company
                if created:
                    created_companies += 1
                    self.stdout.write(f"  Created company: {company_name}")

            company = company_cache[company_name]

            _, created = Role.objects.get_or_create(
                company=company,
                title=item["job_role"],
                defaults={
                    "category": item.get("category", "Technical"),
                    "difficulty": item.get("difficulty", "Fresher"),
                    "experience": item.get("experience", "0-2 Yrs"),
                    "interview_type": item.get("interview_type", "Technical"),
                    "duration_mins": item.get("duration_mins", 60),
                    "about_role": item.get("about_role", ""),
                    "skills": item.get("skills_assessed", []),
                    "interview_structure": item.get("interview_structure", []),
                    "what_to_expect": item.get("what_to_expect", []),
                },
            )
            if created:
                created_roles += 1
                self.stdout.write(f"  Created role: {item['job_role']} @ {company_name}")

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone. Companies created: {created_companies}, Roles created: {created_roles}"
            )
        )
