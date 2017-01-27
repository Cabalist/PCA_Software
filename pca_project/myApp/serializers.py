
from myApp.models import *

from rest_framework import serializers
from django.contrib.auth.models import User

class OrgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields= ['id','name','location','description','logo']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk','username','first_name','last_name','email']

        
#used in bookkeeper to get all users
class OrgUsersSerializer(serializers.ModelSerializer):
    userInfo = UserSerializer(source='user')
    
    class Meta:
        model = UserOrganizationRoleRel
        fields= ['id','role','userInfo','organization','request_date','status','approvedOrRejectedBy']
        
##This is used in /#/profile to get info on specific user. 
class UserOrgRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOrganizationRoleRel
        fields= ['id','user','organization','request_date','status','approvedOrRejectedBy']

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields= ['id','formDate','donor','donationType','value','addedOn']

class HoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hours
        fields= ['id','user','org','date','hoursType','hours']


class PayTermsSerializer(serializers.ModelSerializer):
    userInfo = UserSerializer(source="user")

    class Meta:
        model = PayTerms
        fields= ['id','userInfo','percent','startDate', 'endDate' ,'termsType']
