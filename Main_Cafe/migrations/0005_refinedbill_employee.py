# Generated by Django 2.2 on 2024-03-30 15:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Main_Cafe', '0004_delete_bill'),
    ]

    operations = [
        migrations.AddField(
            model_name='refinedbill',
            name='employee',
            field=models.CharField(default='emp', max_length=30),
            preserve_default=False,
        ),
    ]