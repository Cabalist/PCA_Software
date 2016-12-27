"""pca_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

from myApp import views , api

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^auth/', include('registration.backends.simple.urls')),

    #landing page
    url(r'^$', views.landing,name="index"),

    #profile SPA entry point
    url(r'^profile/$',views.profileViewer),


    #REST API
    url(r'^api/rest/userRoles/(?P<userId>\d+)$', api.userRoles),
    url(r'^api/rest/orgList$', api.orgList),
    url(r'^api/rest/joinOrgRequest/(?P<orgId>\d+)$', api.joinOrgRequest),
    #url(r'^api/rest/form1$', api.form1),
    url(r'^api/rest/donation$', api.donation),
    
]
