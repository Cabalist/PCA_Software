
from myApp.models import *

from rest_framework import serializers


class OrgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields= ['id','name','location','description','logo']

class UserOrgRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOrganizationRoleRel
        fields= ['id','user','organization','join_date','status','approvedOrRejectedBy']

#class Form1Serializer(serializers.ModelSerializer):
#    class Meta:
#        model = Form1
#        fields = ['id','user','org','date','canvassHours','trf','status']


#class DonationSerializer(serializers.ModelSerializer):
#   class Meta:
#      model = Donation
#      fields = ['id','form','chk','cc','money']
