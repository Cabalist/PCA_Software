from django.shortcuts import render

# Create your views here.
def landing(request):
    html = ""
    if request.user.is_authenticated():
        html = render(request,'landingSession.html')
    else:
        html = render(request,'landing.html')

    return html
                        
def profileViewer(request):
    
    html = ""
    if request.user.is_authenticated():
        html = render(request,'profileSession.html')
    else:
        html = render(request,'profile.html')

    return html
