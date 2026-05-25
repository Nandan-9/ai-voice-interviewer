import json
import os
from django.core.management.base import BaseCommand
from company.models import Company, Role, QuestionBank


class Command(BaseCommand):
    help = "Load questions from interview_dataset.json into QuestionBank"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            type=str,
            default="interview_dataset.json",
            help="Path to the JSON dataset file (default: interview_dataset.json)",
        )

    def handle(self, *args, **options):
        file_path = options["file"]

        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        with open(file_path, "r") as f:
            data = json.load(f)

        created_count = 0
        skipped_count = 0

        for entry in data:
            company_name = entry.get("company", "").strip()
            job_role = entry.get("job_role", "").strip()
            category = entry.get("category", "").strip()
            difficulty = entry.get("difficulty", "Fresher").strip()
            question_text = entry.get("question", "").strip()
            answer_text = entry.get("model_answer", "").strip()
            keywords = entry.get("keywords", [])

            company, _ = Company.objects.get_or_create(name=company_name)
            role, _ = Role.objects.get_or_create(
                company=company,
                description=job_role,
            )

            if QuestionBank.objects.filter(question=question_text, role=role).exists():
                skipped_count += 1
                continue

            QuestionBank.objects.create(
                role=role,
                question=question_text,
                answer=answer_text,
                category=category,
                difficulty=difficulty,
                keywords=keywords,
            )
            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Created: {created_count}, Skipped (already exists): {skipped_count}"
            )
        )
