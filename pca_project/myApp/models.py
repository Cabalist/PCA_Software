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
    status = models.IntegerField(default=0) #0-Waiting for approval, 1-Approved, 2-Rejected, 3-terminated
    approvedOrRejectedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="admin",null=True)
    approvedOrRejectDate = models.DateTimeField(null=True)

class ManagerWorkerRel(models.Model):
    manager = models.ForeignKey(settings.AUTH_USER_MODEL)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    worker = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="worker")
    startDate = models.DateField()
    endDate = models.DateField(null=True)
    assignedBy =  models.ForeignKey(settings.AUTH_USER_MODEL,related_name="managerAssigner")
    assignedOn = models.DateTimeField()

#This table is only used to store newcomer share
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
    hoursType = models.IntegerField()  #1 - canvassing, 2 - admin, 3 - travel , 4 - special projects
    hours = models.FloatField()
    addedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="addedHours")
    addedOn = models.DateTimeField()

class PayRate(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    hoursType = models.IntegerField() #1 - canvassing, 2- admin, 3-travel, 4- special projects
    rate = models.FloatField()
    startDate = models.DateField()
    setBy = models.ForeignKey(settings.AUTH_USER_MODEL)
    setOn = models.DateTimeField()

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

class ReimbursementRequest(models.Model):
    org = models.ForeignKey(Organization)
    workerId = models.ForeignKey(settings.AUTH_USER_MODEL)
    date = models.DateField()
    payee = models.CharField(max_length=16)
    reimType = models.IntegerField()
    purpose = models.CharField(max_length=32)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    requestedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="reimbursementRequester")
    requestedOn = models.DateTimeField()
    
class ReimbursementResponse(models.Model):
    request = models.OneToOneField(ReimbursementRequest)
    status = models.IntegerField()
    reviewedBy = models.ForeignKey(settings.AUTH_USER_MODEL)
    reviewedOn = models.DateField()
    respondedBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="reimbursementResponder")
    respondedOn = models.DateTimeField()

class Invoice(models.Model):
    org = models.ForeignKey(Organization)
    invNum = models.IntegerField()
    billFrom = models.CharField(max_length=32)
    billTo = models.CharField(max_length=32)
    addr = models.CharField(max_length=64,null=True)
    state = models.CharField(max_length=2,null=True)
    zip = models.CharField(max_length=10,null=True)
    date = models.DateField()

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice)
    description = models.CharField(max_length=512)
    amount = models.DecimalField(max_digits=7, decimal_places=2)
    tax = models.DecimalField(max_digits=5, decimal_places=2)
