from django.db import models

# Create your models here.


class Company(models.Model):
    name = models.CharField(max_length=100,unique=True,blank=False,null= False)



class Role(models.Model):
    company = models.ForeignKey(Company,on_delete=models.CASCADE, related_name="roles")
    description = models.CharField(max_length=500,null=False,blank=False)
    skills = models.JSONField(default=list)


class QuestionBank(models.Model):
    role = models.ForeignKey(Role,on_delete=models.CASCADE, related_name="questions")
    question = models.CharField(max_length=500,null= False,blank=False)
    answer = models.CharField(max_length=500,null= False,blank=False)


    