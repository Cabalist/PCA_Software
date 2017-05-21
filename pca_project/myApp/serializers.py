
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

class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model =Donor
        fields= ["name","state","zipcode"]
        
class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields= ['id','formDate','donor','donationType','value','addedOn']


class AdjustmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationAdjustment
        fields = '__all__'

class CheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Check
        fields = '__all__'
        
class CreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model =CreditCard
        fields= '__all__'
        
class AdjustmentsReportSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    adjustments = AdjustmentsSerializer(source='donationadjustment_set',many=True)
    donor = DonorSerializer()
    cc = CreditCardSerializer(source='creditcard_set',many=True)
    ck = CheckSerializer(source='check_set',many=True)
    
    class Meta:
        model = Donation
        fields = ['id', 'user', 'donor', 'formDate', 'donationType','value','adjustments','cc','ck']
        
class HoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hours
        fields= ['id','user','org','date','hoursType','hours']

class PayTermsSerializer(serializers.ModelSerializer):
    userInfo = UserSerializer(source="user")

    class Meta:
        model = PayTerms
        fields= ['id','userInfo','percent','startDate', 'endDate' ,'termsType']

class PayTermsLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayTerms
        fields= ['id','percent','startDate', 'endDate' ,'termsType']

class Donations1Serializer(serializers.ModelSerializer):
    user = UserSerializer()
    donor = DonorSerializer()
    payTerms = PayTermsLiteSerializer()

    class Meta:
        model = Donation
        fields=['id','user','formDate','donor','donationType','value','addedOn','payTerms']


class ReimbursementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reimbursement
        fields = '__all__'
