# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-25 03:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0002_userorgjoinrequest'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userorgjoinrequest',
            old_name='approvedOrRejecteBy',
            new_name='approvedOrRejectedBy',
        ),
    ]