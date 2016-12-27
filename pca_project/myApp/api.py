from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User

from myApp.models import UserOrgJoinRequest, UserOrganizationRoleRel, Organization, Form1
from myApp.serializers import *
from datetime import datetime
import pytz

@csrf_exempt
def userRoles(request,userId=None):
    if request.method=='GET':
        roles = UserOrganizationRoleRel.objects.filter(user = userId).order_by('organization')
        roleResults = []

        for role in roles.all():
            org = role.organization
            #check if organiztion is already in results list
            if len(roleResults):
                if roleResults[len(roleResults)-1]["organization"]["id"] == org.id:
                    #append new roles to listed org
                    roleResults[len(roleResults)-1]["roles"].append(role.role)
                    
                else:
                    #add new organization
                    roleResults.append({'organization':{'id':org.id,'name':org.name,'logo':org.logo},'roles':[role.role]})
                    
            else:
                roleResults.append({'organization':{'id':org.id,'name':org.name,'logo':org.logo},'roles':[role.role]})

        #Add pending requests:
        pending = UserOrgJoinRequest.objects.filter(user = userId).filter(status=0).all()
        serialized = UserOrgJoinRequestSerializer(pending,many=True)

        finalResult = {"roles":roleResults,"pending":serialized.data}

        return JsonResponse(finalResult, safe=False)


@csrf_exempt
def joinOrgRequest(request,orgId=None):
    if request.method=="GET":
        org = Organization.objects.get(id = orgId)
        requests = UserOrgJoinRequest.objects.filter(organization=org).filter(status=0).all()

        serialized = UserOrgJoinRequestSerializer(requests,many=True)
        
        return JsonResponse(serialized.data, safe=False)
        
    if request.method=='POST':
        data = JSONParser().parse(request)
        userId = data["userId"]
        user = User.objects.get(pk=int(data["userId"]))
        
        org = Organization.objects.get(id = data["orgId"])

        time  = datetime.now(pytz.timezone('US/Pacific'))
        #If advStatus = active, need to unset previous active.
        
        request = UserOrgJoinRequest(user=user,organization=org,requestDate = time,status=0)
        request.save()

        serialized = UserOrgJoinRequestSerializer(request)
        
        return JsonResponse(serialized.data, safe=False)

    if request.method == "PUT":    
        data = JSONParser().parse(request)
        reqId = data["id"]

        reqObj = UserOrgJoinRequest.objects.filter(id=data['id']).update(status=data['status'],approvedOrRejectedBy=data['approvedOrRejectedBy'])
        
        modifiedObj = UserOrgJoinRequest.objects.get(id=data['id'])
        serialized = UserOrgJoinRequestSerializer(modifiedObj)
        
        if data['status']==1: #need to create role objs
            user = User.objects.get(pk=int(data["user"]))
            org = Organization.objects.get(id = data["organization"])
            
            time  = datetime.now(pytz.timezone('US/Pacific'))

            newRole = UserOrganizationRoleRel(user=user,organization=org,role=2,join_date=time)
            newRole.save()
            
        return JsonResponse(serialized.data, safe=False)
        
@csrf_exempt
def orgList(request):
    if request.method == "GET":
        
        results = []
        for org in Organization.objects.all().order_by("location"):
            if len(results)==0: #if there are no items in list, add new item

                results.append({"location":org.location,"orgs":[OrgSerializer(org).data]})
            else: #if there are items in the list..

                if results[len(results)-1]["location"]==org.location: #if location already exists in results... append new org to that location
                    results[len(results)-1]["orgs"].append(OrgSerializer(org).data)
                else:
                    results.append({"location":org.location,"orgs":[OrgSerializer(org).data]})

        return JsonResponse(results, safe=False)

@csrf_exempt
def form1(request,userId=None):
    if request.method == "PUT":
        data = JSONParser().parse(request)
        if len(data.keys()) == 2:
            formId = data['id']
            status = data['status']

            f = Form1.objects.get(id=formId)
            f.status = status
            f.save()

            serialized = Form1Serializer(f).data
            total = f.totalDonations()
            serialized["total"] = total
            
        return JsonResponse(serialized, safe=False)
        
        
@csrf_exempt
def donation(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        formJson = data["form"]
        chk = data['chk']
        cc = data['cc']
        money = data['money']

        formId = formJson;
        if type(formJson)==type({}): #if got dictionary instead of formId (need to create form1)
            userId = formJson["userId"]
            user = User.objects.get(pk=userId)
            orgId = formJson["orgId"]
            org = Organization.objects.get(id=orgId)
            dateStr = formJson["date"]
            date = datetime.strptime(dateStr,"%m-%d-%Y").date()
            canvassHours = formJson["canvassHours"]
            #otherHours = data["otherHours"]
            trf=formJson["trf"]
            
            newForm = Form1(user=user,org=org,date=date,canvassHours=canvassHours,otherHours=0,trf=trf,status=0)
            newForm.save()

            formId = newForm.id

        form = Form1.objects.get(id=formId)
        newDonation = Donation(form=form,chk=chk,cc=cc,money=money)
        newDonation.save()

        serialized = DonationSerializer(newDonation)
        
        
        return JsonResponse(serialized.data, safe=False)

    
