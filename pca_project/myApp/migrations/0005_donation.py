# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-27 08:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0004_form1'),
    ]

    operations = [
        migrations.CreateModel(
            name='Donation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chk', models.CharField(max_length=12)),
                ('cc', models.CharField(max_length=12)),
                ('money', models.FloatField()),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myApp.Form1')),
            ],
        ),
    ]