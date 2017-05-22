from django.shortcuts import render, redirect
from django.views.decorators.cache import never_cache

from django.contrib.auth import login

from myApp import forms

# Create your views here.
def landing(request):
    html = ""
    if request.user.is_authenticated():
        html = render(request,'landingSession.html')
    else:
        html = render(request,'landing.html')

    return html

@never_cache
def profileViewer(request):
    
    html = ""
    if request.user.is_authenticated():
        html = render(request,'profileSession.html')
    else:
        html = render(request,'profile.html')

    return html



def registration(request):
    if request.method == 'POST':
        form = forms.RegistrationForm(request.POST)
        if form.is_valid():
            newUser = form.save()
            #assign session
            login(request,newUser)
            
            return redirect("/profile/#/")
        else:
            #TODO Raise validation error
            print("invalid shit")
            print(form.is_valid())
            return HttpResponse("Registration error")
    else:
        
        form = forms.RegistrationForm()
        return render(request,"registration/registration_form.html",{'form':form})
    
