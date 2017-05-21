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
    role = models.IntegerField()  #1 - worker, 2 - Manager , 3- Bookkeeper
    request_date = models.DateTimeField(null=True)
    status = models.IntegerField(default=0) #0-Waiting for approval, 1-Approved, 2-Rejected
    approvedOrRejectedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="admin",null=True)
    approvedOrRejectDate = models.DateTimeField(null=True)

class OrgSettings(models.Model):
    org = models.ForeignKey(Organization)
    settingName = models.CharField(max_length=16)
    settingValue = models.CharField(max_length=128)
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="orgSettingsChanger",null=True)
    addedDate = models.DateTimeField(null=True)
    
class PayTerms(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    termsType = models.IntegerField() # 1 -- base level (doesn't need start and end dates) 2--temporary, requires dates
    percent = models.FloatField()
    startDate = models.DateField(null=True)
    endDate = models.DateField(null=True)
    description = models.CharField(max_length=512, null=True)
    notes = models.CharField(max_length=1024, null=True )
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="payTermsAdder",null=True)
    addedOn = models.DateTimeField(null=True)

class Hours(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    date = models.DateField()
    hoursType = models.IntegerField()  #1 - canvassing, 2 - admin, 3 - travel
    hours = models.FloatField()
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="addedHours")
    addedOn = models.DateTimeField()
    
class Donor(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)  #This refers to recruiter 
    org = models.ForeignKey(Organization,on_delete=models.CASCADE)
    name = models.CharField(max_length=32)
    addr = models.CharField(max_length=64, null=True)
    city = models.CharField(max_length=16, null=True)
    state = models.CharField(max_length=2, null=True)
    zipcode = models.CharField(max_length=12,null=True)
    email = models.EmailField(null=True)
    phone = models.CharField(max_length=16,null=True)
    over18 = models.BooleanField()
    addedOn = models.DateTimeField()
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="addedDonor")

class Donation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)  #This refers to recruiter
    org = models.ForeignKey(Organization)
    donor = models.ForeignKey(Donor)
    payTerms = models.ForeignKey(PayTerms,null=True)
    formDate = models.DateField()
    donationType = models.IntegerField() #1 - cash, 2 - creditcard, 3- check
    value = models.FloatField()
    addedOn = models.DateTimeField()
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="addedDonation")

class Check(models.Model):
    donation = models.ForeignKey(Donation)
    
    checkNum = models.CharField(max_length=10)
    checkDate = models.DateField()


class CreditCard(models.Model):
    donation = models.ForeignKey(Donation)
    nameOnCard = models.CharField(max_length=32)
    last4 = models.IntegerField()
    exp = models.CharField(max_length=7)
    recurring = models.BooleanField()


class DonationAdjustment(models.Model): #This is transaction status... and fee if successful.
    donation = models.ForeignKey(Donation)
    proccessedBy = models.ForeignKey(settings.AUTH_USER_MODEL)
    proccessedOn = models.DateTimeField()
    
    status = models.IntegerField() #0 - pending processing, 1- success, 2 - fail
    fee = models.FloatField(null=True)
    notes = models.CharField(max_length=128)

class Reimbursement(models.Model):
    org = models.ForeignKey(Organization)
    worker = models.ForeignKey(settings.AUTH_USER_MODEL)    
    year = models.IntegerField()
    period = models.IntegerField()
    startDate = models.DateField()
    endDate = models.DateField()
    
    value = models.FloatField()
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="reimburser")
    addedOn = models.DateTimeField()
    
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
