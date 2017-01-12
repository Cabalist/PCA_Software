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
    request_date = models.DateTimeField(null=True)
    status = models.IntegerField(default=0) #0-Waiting for approval, 1-Approved, 2-Rejected
    approvedOrRejectedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="admin",null=True)
    approvedOrRejectDate = models.DateTimeField(null=True)
    
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
    zipcode = models.CharField(max_length=12)
    email = models.EmailField()
    phone = models.CharField(max_length=16)
    over18 = models.BooleanField()
    addedOn = models.DateField()
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="addedDonor")

class Donation(models.Model):
    donor = models.ForeignKey(Donors)
    payTerms = models.ForeignKey(PayTerms)
    donationType = models.IntegerField() #1 - cash, 2 - creditcard, 3- check
    value = models.FloatField()
    addedOn = models.DateField()
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="addedDonation")

class Check(models.Model):
    donation = models.ForeignKey(Donation)
    proccessedBy = models.ForeignKey(settings.AUTH_USER_MODEL)
    checkNum = models.CharField(max_length=10)
    checkDate = models.DateField()
    status = models.IntegerField() #0 - pending proccessing, 1 - success, 2 - fail
    processedOn = models.DateTimeField()
    notes = models.CharField(max_length=128)

class CreditCard(models.Model):
    donation = models.ForeignKey(Donation)
    nameOnCard = models.CharField(max_length=32)
    last4 = models.IntegerField()
    exp = models.CharField(max_length=7)
    recurring = models.BooleanField()
    
class CCTransaction(models.Model):
    creditCard = models.ForeignKey(CreditCard)
    proccessedBy = models.ForeignKey(settings.AUTH_USER_MODEL)
    proccessedOn = models.DateTimeField()
    status = models.IntegerField() #0 - pending processing, 1- success, 2 - fail
    notes = models.CharField(max_length=128)
    
    
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
