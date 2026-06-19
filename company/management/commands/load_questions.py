import json
import os
from django.core.management.base import BaseCommand
from company.models import Role, QuestionBank


class Command(BaseCommand):
    help = "Load questions from interview_dataset_test.json into QuestionBank"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            type=str,
            default="interview_dataset_test.json",
            help="Path to the JSON dataset file",
        )

    def handle(self, **options):
        from django.conf import settings
        file_path = os.path.join(settings.BASE_DIR, options["file"])

        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        with open(file_path) as f:
            data = json.load(f)

        created_count = 0
        skipped_count = 0

        for entry in data:
            role_id = entry.get("role_id")
            try:
                role = Role.objects.get(id=role_id)
            except Role.DoesNotExist:
                self.stderr.write(self.style.WARNING(
                    f"  Role id={role_id} ({entry.get('company')} - {entry.get('job_role')}) not found, skipping"
                ))
                continue

            for q in entry.get("questions", []):
                _, created = QuestionBank.objects.get_or_create(
                    role=role,
                    question=q["question"],
                    defaults={
                        "answer": q["answer"],
                        "category": q.get("category", "General"),
                        "difficulty": q.get("difficulty", "Fresher"),
                        "keywords": q.get("keywords", []),
                    },
                )
                if created:
                    created_count += 1
                else:
                    skipped_count += 1

            self.stdout.write(f"  Loaded questions for: {role.company.name} - {role.title}")

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. Created: {created_count}, Skipped (already exists): {skipped_count}"
        ))
