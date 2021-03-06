# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-01-20 08:17
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0019_auto_20170120_0702'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrgSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('settingName', models.CharField(max_length=16)),
                ('settingValue', models.CharField(max_length=128)),
                ('org', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myApp.Organization')),
            ],
        ),
    ]
