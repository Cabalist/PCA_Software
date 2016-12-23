from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from myApp.models import UserOrganizationRoleRel

@csrf_exempt
def userRoles(request,userId=None):
    if request.method=='GET':
        return JsonResponse(total, safe=False)
