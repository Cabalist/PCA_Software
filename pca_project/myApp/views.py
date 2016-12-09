from django.shortcuts import render

# Create your views here.
def landing(request):
    html = ""
    if request.user.is_authenticated():
        html = render(request,'landingSession.html')
    else:
        html = render(request,'landing.html')

    return html
                        
def profileViewer(request, userName):
    #check if username exists...
    #get userID from userName

    context = { 'userName': userName, 'userId':1}
    html = ""
    if request.user.is_authenticated():
        html = render(request,'profileSession.html')
    else:
        html = render(request,'profile.html')

    return html
