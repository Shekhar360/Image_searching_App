from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login,logout
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
import re
import random


@login_required
def index(request):
    return render(request,'index.html')
def login_view(request):
    if request.method == "GET":
        return render(request,'login.html')

    cred = request.POST
    email = cred.get("email", "")
    password = cred.get("password", "")

    if not User.objects.filter(email=email).exists():
        messages.add_message(request, messages.WARNING, "No user found!")
        return redirect("login")
    user = authenticate(request=request,username=email, email=email, password=password)
    if not user:
        print(user)
        messages.add_message(request, messages.ERROR, "Wrong Credentials!")
        return redirect("login")

    login(request, user)
    messages.add_message(request, messages.INFO, "Login successful!")
    return redirect("index")

def signup_view(request):
    if request.method == "POST":
        cred = request.POST
        email = cred.get("email", "")
        password = cred.get("password", "")
        confirm = cred.get("confirm-password", "")
        if User.objects.filter(email=email):
            messages.add_message(request, messages.INFO, "This username already exists!")
            return redirect("signup")
        if password != confirm:
            messages.add_message(request, messages.ERROR, "Password does not match!")
            return redirect("signup")
       
        otp = random.randint(1000, 9999)
        send_mail(
            "OTP Verification", f"Your OTP is {otp}", settings.EMAIL_HOST_USER, [email]
        )
        request.session["otp"] = otp
        request.session["email"] = email
        request.session["password"] = password
        messages.add_message(request, messages.SUCCESS, "OTP sent at your email!")
        return redirect("otp")

    return render(request,'signup.html')


def otp_view(request):
    if request.method == "GET":
        print(request.GET.get("cancle"))
        if request.GET.get("cancle") == "cancle":
            return redirect("Signup")
        return render(request, "otp.html")
    if request.session.get("otp", "") != int(request.POST.get("otp", "")):
        messages.add_message(request, messages.ERROR, "Wrong OTP!")
        return redirect("Otp")
    user = User.objects.create_user(username=request.session.get("email", ""))
    user.email = request.session.get("email", "")
    user.set_password(request.session.get("password", ""))
    user.save()
    messages.add_message(request, messages.SUCCESS, "Successfuly Signed Up")
    return redirect("login")


def logout_view(req):
    logout(req)
    messages.add_message(req, messages.SUCCESS, "Logout successful!")
    return redirect("login")
