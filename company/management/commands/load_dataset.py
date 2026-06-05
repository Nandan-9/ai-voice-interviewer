import json
import os

from django.core.management.base import BaseCommand

from company.models import Company, QuestionBank, Role


class Command(BaseCommand):
    help = "Load companies, roles, and questions from interview_dataset.json"

    def handle(self, *args, **options):
        from django.conf import settings
        dataset_path = os.path.join(settings.BASE_DIR, "interview_dataset.json")

        with open(dataset_path) as f:
            data = json.load(f)

        company_cache = {}
        role_cache = {}
        created_q = 0
        skipped_q = 0

        for item in data:
            company_name = item["company"]
            job_role = item["job_role"]

            if company_name not in company_cache:
                company, created = Company.objects.get_or_create(name=company_name)
                company_cache[company_name] = company
                if created:
                    self.stdout.write(f"  Created company: {company_name}")

            company = company_cache[company_name]
            role_key = (company_name, job_role)

            if role_key not in role_cache:
                role, created = Role.objects.get_or_create(
                    company=company,
                    description=job_role,
                )
                role_cache[role_key] = role
                if created:
                    self.stdout.write(f"  Created role: {job_role} @ {company_name}")

            role = role_cache[role_key]

            _, created = QuestionBank.objects.get_or_create(
                role=role,
                question=item["question"],
                defaults={
                    "answer": item["model_answer"],
                    "category": item["category"],
                    "difficulty": item["difficulty"],
                    "keywords": item.get("keywords", []),
                },
            )
            if created:
                created_q += 1
            else:
                skipped_q += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone. Questions created: {created_q}, already existed: {skipped_q}"
            )
        )
