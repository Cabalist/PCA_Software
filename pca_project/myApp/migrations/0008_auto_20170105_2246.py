# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-01-05 22:46
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('myApp', '0007_auto_20170105_2220'),
    ]

    operations = [
        migrations.CreateModel(
            name='CCTransaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('proccessedOn', models.DateTimeField()),
                ('status', models.IntegerField()),
                ('notes', models.CharField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Check',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkNum', models.CharField(max_length=10)),
                ('checkDate', models.DateField()),
                ('status', models.IntegerField()),
                ('processedOn', models.DateTimeField()),
                ('notes', models.CharField(max_length=128)),
                ('donation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myApp.Donation')),
                ('proccessedBy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CreditCard',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last4', models.IntegerField()),
                ('nameOnCard', models.CharField(max_length=32)),
                ('donation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myApp.Donation')),
            ],
        ),
        migrations.AddField(
            model_name='cctransaction',
            name='creditCard',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myApp.CreditCard'),
        ),
        migrations.AddField(
            model_name='cctransaction',
            name='proccessedBy',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]