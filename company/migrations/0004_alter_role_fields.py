from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0003_alter_questionbank_answer_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='role',
            name='description',
        ),
        migrations.AddField(
            model_name='role',
            name='title',
            field=models.CharField(max_length=200, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='role',
            name='category',
            field=models.CharField(max_length=100, default='Technical'),
        ),
        migrations.AddField(
            model_name='role',
            name='difficulty',
            field=models.CharField(max_length=100, default='Fresher'),
        ),
        migrations.AddField(
            model_name='role',
            name='experience',
            field=models.CharField(max_length=50, default='0-2 Yrs'),
        ),
        migrations.AddField(
            model_name='role',
            name='interview_type',
            field=models.CharField(max_length=100, default='Technical'),
        ),
        migrations.AddField(
            model_name='role',
            name='duration_mins',
            field=models.IntegerField(default=60),
        ),
        migrations.AddField(
            model_name='role',
            name='about_role',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='role',
            name='interview_structure',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='role',
            name='what_to_expect',
            field=models.JSONField(default=list),
        ),
    ]
