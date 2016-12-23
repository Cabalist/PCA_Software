from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from myApp.models import UserOrganizationRoleRel

@csrf_exempt
def userRoles(request,userId=None):
    if request.method=='GET':
        roles = UserOrganizationRoleRel.objects.filter(user = userId).order_by('organization')
        results = []

        for role in roles.all():
            org = role.organization
            #check if organiztion is already in results list
            if len(results):
                if results[len(results)-1]["organization"]["id"] == org.id:
                    #append new roles to listed org
                    results[len(results)-1]["roles"].append(role.role)
                    
                else:
                    #add new organization
                    results.append({'organization':{'id':org.id,'name':org.name,'logo':org.logo},'roles':[role.role]})
                    
            else:
                results.append({'organization':{'id':org.id,'name':org.name,'logo':org.logo},'roles':[role.role]})

        return JsonResponse(results, safe=False)
