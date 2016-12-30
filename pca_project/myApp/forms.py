from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from pca_project import settings
import os


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ("username", "first_name","last_name","email", "password1", "password2")
        
    def save(self, commit=True):
        #calling super(RegistrationForm) internally calls set_password
        user = super(RegistrationForm,self).save(commit=False)
        
        if commit:
            user.save()
        
        #create directory for user media
        target = settings.USER_MEDIA_ROOT+'/'+str(user.id)
        target2 = target + "/profile_pictures"
        os.mkdir(target)
        os.mkdir(target2)
        
        return user
        
