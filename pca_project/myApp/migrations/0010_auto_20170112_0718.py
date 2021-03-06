# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-01-12 07:18
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('myApp', '0009_auto_20170108_1747'),
    ]

    operations = [
        migrations.RenameField(
            model_name='donation',
            old_name='date',
            new_name='addedOn',
        ),
        migrations.RemoveField(
            model_name='donation',
            name='recurring',
        ),
        migrations.AddField(
            model_name='creditcard',
            name='exp',
            field=models.CharField(default=None, max_length=7),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='creditcard',
            name='recurring',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='donation',
            name='addedBy',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='addedDonation', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='donors',
            name='zipcode',
            field=models.CharField(default=None, max_length=12),
            preserve_default=False,
        ),
    ]
