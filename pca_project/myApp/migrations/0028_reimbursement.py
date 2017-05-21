# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-05-20 23:30
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('myApp', '0027_auto_20170425_1755'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reimbursement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField()),
                ('period', models.IntegerField()),
                ('startDate', models.DateField()),
                ('endDate', models.DateField()),
                ('value', models.FloatField()),
                ('addedOn', models.DateTimeField()),
                ('addedBy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reimburser', to=settings.AUTH_USER_MODEL)),
                ('org', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myApp.Organization')),
                ('worker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
