"""MainCafe URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from Main_Cafe import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/',views.login_page,name="login"),
    path('',views.homepage,name='home'),
    path('adminverif/',views.admin_handle,name='admin'),
    path('empverif/',views.emp_handle,name='emp'),
    path('admindash/',views.admin_dashboard,name='admindash'),
    path('empdash/',views.emp_dashboard,name='employeedash'),
    path('logout/',views.logout_page,name='logout'),
    path('billhandle/',views.bill_handle,name='billhandle'),
    path('dishadd/', views.add_dish ,name="add_dish"),
    path('menu/', views.menu_handler,name="menuhandle"),
    path('addemp/', views.add_emp, name="addemp"),
    path('viewemp/',views.view_emp,name='viewemp'),
    path('viewbill/',views.view_bills,name='viewbill'),
    path('empdelete/', views.delete_emp, name="empdelete"),
    path('billdelete/',views.delete_bill,name="billdelete"),
    path('confirm/',views.confirm,name="confirm")
]