from django.db import models
from django.conf import settings

# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=128)
    location = models.CharField(max_length=128)
    description = models.CharField(max_length=760)
    logo = models.IntegerField()
    
class UserOrganizationRoleRel(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    role = models.IntegerField()
    join_date = models.DateField()

class UserOrgJoinRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    requestDate = models.DateTimeField(default=0)
    status = models.IntegerField(default=0) #1 approved, 2 rejected
    approvedOrRejectedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="admin", null=True)
    
