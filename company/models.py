from django.db import models

# Create your models here.


class Company(models.Model):
    name = models.CharField(max_length=100,unique=True,blank=False,null= False)


class Role(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="roles")
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default="Technical")
    difficulty = models.CharField(max_length=100, default="Fresher")
    experience = models.CharField(max_length=50, default="0-2 Yrs")
    interview_type = models.CharField(max_length=100, default="Technical")
    duration_mins = models.IntegerField(default=60)
    about_role = models.TextField(blank=True)
    skills = models.JSONField(default=list)
    interview_structure = models.JSONField(default=list)
    what_to_expect = models.JSONField(default=list)


class QuestionBank(models.Model):
    role = models.ForeignKey(Role,on_delete=models.CASCADE, related_name="questions")
    question = models.TextField(null=False, blank=False)
    answer = models.TextField(null=False, blank=False)
    category = models.CharField(max_length=100, blank=False, null=False, default="General")
    difficulty = models.CharField(max_length=100, blank=False, null=False, default="Fresher")
    keywords = models.JSONField(default=list)


    