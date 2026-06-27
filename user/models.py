import uuid

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# Create your models here.


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    course = models.CharField(max_length=150)
    passing_out = models.IntegerField(blank=False,null=False)
    bio = models.CharField(max_length=500,blank=False,null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


    def __str__(self):
        return self.email






class InterviewSessions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interview_sessions")
    over_all_score = models.IntegerField(null=True, blank=True)
    over_all_eval = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.id}"


class InterviewResponse(models.Model):
    session = models.ForeignKey(InterviewSessions, on_delete=models.CASCADE, related_name="responses")
    question = models.ForeignKey("company.QuestionBank", on_delete=models.CASCADE, related_name="responses")
    response = models.CharField(max_length=2000, null=True, blank=True)
    strength = models.CharField(max_length=1000, null=True, blank=True)
    weakness = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return f"Response for session {self.session.id}"
