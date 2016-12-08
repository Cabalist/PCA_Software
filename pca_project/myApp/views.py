from django.shortcuts import render

# Create your views here.
def landing(request):
    html = render(request,'landing.html')
    if request.user.is_authenticated():
        html = render(request,'landingSession.html')

    return html
                        
