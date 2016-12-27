
from myApp.models import *

from rest_framework import serializers

class UserOrgJoinRequestSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserOrgJoinRequest
            fields= ['id','user','organization','requestDate','status']

class OrgSerializer(serializers.ModelSerializer):
        class Meta:
            model = Organization
            fields= ['id','name','location','description','logo']

class Form1Serializer(serializers.ModelSerializer):
        class Meta:
            model = Form1
            fields = ['id','user','org','date','canvassHours','trf','status']


class DonationSerializer(serializers.ModelSerializer):
   class Meta:
      model = Donation
      fields = ['id','form','chk','cc','money']
