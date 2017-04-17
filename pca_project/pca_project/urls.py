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

    url(r'^auth/register/$', views.registration),
    url(r'^auth/', include('registration.backends.simple.urls')),

    #landing page
    url(r'^$', views.landing,name="index"),

    #profile SPA entry point
    url(r'^profile/$',views.profileViewer),


    #REST API
    url(r'^api/rest/userRoles/(?P<userId>\d+)$', api.userRoles),
    url(r'^api/rest/orgList$', api.orgList),
    url(r'^api/rest/orgUsers/(?P<orgId>\d+)$', api.orgUsers),
    url(r'^api/rest/orgWorkers/(?P<orgId>\d+)$', api.orgWorkers),
    url(r'^api/rest/donation$', api.donation),
    url(r'^api/rest/payTerms/(?P<orgId>\d+)$', api.payTerms),
    url(r'^api/rest/newcomerShare/(?P<orgId>\d+)$', api.newcomerShare),

    url(r'^api/rest/donationHist/(?P<userId>\d+)/(?P<orgId>\d+)$', api.donationHist),
    url(r'^api/rest/hours/(?P<userId>\d+)/(?P<orgId>\d+)$', api.hours),
    url(r'^api/rest/orgAdjustments/(?P<orgId>\d+)/(?P<year>\d+)$', api.adjustments),

    #reports
    url(r'^api/rest/orgYTDDonations/(?P<orgId>\d+)/(?P<year>\d+)$',api.orgYTDDonations),
    url(r'^api/rest/c2wReport/(?P<orgId>\d+)/(?P<start>[\w\-]+)/(?P<end>[\w\-]+)$',api.c2wReport)
    
]
