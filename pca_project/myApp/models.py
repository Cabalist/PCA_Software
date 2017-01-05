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
    status = models.IntegerField(default=0) #1 approved, 2 rejected
    approvedOrRejectedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="admin",null=True)

class PayTerms(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    percentTFR = models.FloatField()
    startDate = models.DateField()
    endDate = models.DateField()
    description = models.CharField(max_length=512)
    notes = models.CharField(max_length=1024)


class Donors(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)  #This refers to recruiter 
    org = models.ForeignKey(Organization,on_delete=models.CASCADE)
    name = models.CharField(max_length=32)
    addr = models.CharField(max_length=64)
    city = models.CharField(max_length=16)
    state = models.CharField(max_length=2)
    email = models.EmailField()
    phone = models.CharField(max_length=16)
    over18 = models.BooleanField()
    addedOn = models.DateField()
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="addedDonor")


#class UserOrgJoinRequest(models.Model):
#    user = models.ForeignKey(settings.AUTH_USER_MODEL)
#    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
#    requestDate = models.DateTimeField(default=0)
#    status = models.IntegerField(default=0) #1 approved, 2 rejected
#    approvedOrRejectedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="admin", null=True)
    
#class Form1(models.Model):
#    user = models.ForeignKey(settings.AUTH_USER_MODEL)
#    org = models.ForeignKey(Organization,on_delete = models.CASCADE)
#    date = models.DateField()
#    canvassHours = models.IntegerField()
#    otherHours = models.IntegerField()
#    trf = models.CharField(max_length=32)
#    status = models.IntegerField(default=0)

#    def totalDonations(self):
#        return self.donation_set.all().aggregate(models.Sum('money'))['money__sum']

#class Donation(models.Model):
#    donor = models.
#    form = models.ForeignKey(Form1,on_delete=models.CASCADE)
#    chk = models.CharField(max_length=12)
#    cc = models.CharField(max_length=12)
#    money = models.FloatField()
