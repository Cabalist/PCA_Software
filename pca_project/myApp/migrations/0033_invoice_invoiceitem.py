# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-06-26 17:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0032_auto_20170524_2139'),
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invNum', models.IntegerField()),
                ('billFrom', models.CharField(max_length=32)),
                ('billTo', models.CharField(max_length=32)),
                ('date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='InvoiceItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=512)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=7)),
                ('tax', models.DecimalField(decimal_places=2, max_digits=5)),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myApp.Invoice')),
            ],
        ),
    ]
