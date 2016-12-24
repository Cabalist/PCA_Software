
from myApp.models import *

from rest_framework import serializers

class UserOrgJoinRequestSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserOrgJoinRequest
            fields= ['user','organization','requestDate','status']
                            
