from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.models import User
from django.contrib.auth import login,logout,authenticate
from django.contrib import messages
from Main_Cafe.models import RefinedBill
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import cache_control
import random
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph , Table , Image ,TableStyle
from reportlab.lib.styles import getSampleStyleSheet ,ParagraphStyle
from reportlab.lib import colors
import json
import os
from django.contrib.auth.models import User
from bson import Decimal128

def login_page(request):
    return render(request,'login.html')


def homepage(request):
    return render(request,'login.html')


@cache_control(max_age=0, no_cache=True, no_store=True, must_revalidate=True)
def admin_handle(request):
    if request.method=='POST':
        data=request.POST
        username=data.get('cf-adminname')
        password=data.get('cf-adminpass')
        user=User.objects.filter(username=username)
        if user.exists():
            user=authenticate(username=username,password=password)
            if user is None:
                messages.error(request,'invalid password',extra_tags='from_admin_handle')
                return redirect('/login/')
            else:
                login(request,user)
                return redirect('/admindash/')
        else:
            messages.error(request,'invalid username',extra_tags='from_admin_handle')
            return redirect('/login/')
    return redirect(request,'/login/')


@cache_control(max_age=0, no_cache=True, no_store=True, must_revalidate=True)
def emp_handle(request):
    if request.method=='POST':
        data=request.POST
        username=data.get('cf-empname')
        password=data.get('cf-emppass')
        user=User.objects.filter(username=username)
        if user.exists():
            user=authenticate(username=username,password=password)
            if user is None:
                messages.error(request,'invalid password',extra_tags='from_emp_handle')
                return redirect('/login/')
            else:
                login(request,user)
                return redirect('/empdash/')
        else:
            messages.error(request,'invalid username',extra_tags='from_emp_handle')
            return redirect('/login/')
    return render(request,'/login/')

@login_required(login_url='')
def admin_dashboard(request):
    return render(request,'admin_dashboard.html')

@login_required(login_url='')
def emp_dashboard(request):
    return render(request,'emp_dashboard.html')

@login_required(login_url='')
@csrf_exempt
def bill_handle(request):
    if request.method=='POST':
        data=request.POST
        item_names = request.POST.getlist('item_name[]')      
        quantity=data.getlist('quantity[]')
        price=data.getlist('price[]')
        total_amt=data.get('total_payment')
        payment_type=data.get('payment_type')
        print(payment_type)
        bill_id=random.randint(100000, 999999)
        employee = request.user.username
        print(employee)
        bill=RefinedBill.objects.filter(bill_id=bill_id)
        if not bill.exists():
            if item_names is None or quantity is None or price is None or total_amt is None or payment_type is None:
                messages.error(request,'Payement Type or Dish not selected')
                return redirect('employeedash')
                
            else:
                bill=RefinedBill.objects.create(
                   bill_id=bill_id,
                   name=item_names,
                   quantity=quantity,
                   price=price,
                   total=total_amt,
                   payment=payment_type,
                   time=datetime.now(),
                   employee = employee
                  )
                return generate_pdf(request,bill_id,item_names,quantity,price,total_amt,payment_type)
        else:
            if item_names is None or quantity is None or price is None or total_amt is None or payment_type is None:
                messages.error(request,'Payement Type or Dish not selected')
                return redirect('employeedash')
            else:
               bill_id+=1
               bill=RefinedBill.objects.create(
                  bill_id=bill_id,
                  name=item_names,
                  quantity=quantity,
                  price=price,
                  total=total_amt,
                  payment=payment_type,
                  time=datetime.now(),
                  employee =employee
                )
               return generate_pdf(request,bill_id,item_names,quantity,price,total_amt,payment_type)
    return render(request,'emp_dashboard.html')

def generate_pdf(request,bill_id,items,quantity,price,total_amt,payment_type):
    pdf_content = generate_pdf_content(bill_id, items, quantity, price, total_amt, payment_type)
    response = HttpResponse(pdf_content, content_type='application/pdf')
    return response

def generate_pdf_content(bill_id,items,quantity,price,total_amt,payment_type):
    cafe_name="Waffles Delight"
    styles=getSampleStyleSheet()
    cafe_name_style = ParagraphStyle(name='CenteredHeading', alignment=1, parent=styles['Heading1'])
    total_style=ParagraphStyle(name='CenteredHeading', alignment=1, parent=styles['Normal'])
    current_time = datetime.now()
    time=current_time.strftime("%Y-%m-%d %H:%M:%S")
    buffer=BytesIO()
    doc=SimpleDocTemplate(buffer, pagesize=letter)
    content=[]
    logo_path = 'Main_Cafe/static/images/random_waffle_logo.jpg'
    logo = Image(logo_path, width=100, height=100)
    content.append(logo)
    content.append(Paragraph(cafe_name, cafe_name_style))
    content.append(Paragraph(f"Bill No #{bill_id}",total_style))
    content.append(Paragraph(f"Date : {time}",total_style))
    table_data = [
        ["Item", "Quantity", "Price"],
    ]
    for item,prices,quantities in zip(items,price,quantity):
        item_info = f"{item}"
        price_info=f"{prices}"
        quantity_info=f"{quantities}"
        table_data.append([item_info,quantity_info,price_info])
    table=Table(table_data)
    table.setStyle(TableStyle([('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                               ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                               ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                               ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                               ('BOX', (0, 0), (-1, -1), 0.25, colors.black)]))
    content.append(table)
    content.append(Paragraph(f"Total : Rs {total_amt}", total_style))
    content.append(Paragraph(f"Payment Type : {payment_type}", total_style))
    doc.build(content)
    pdf_content = buffer.getvalue()
    buffer.close()
    return pdf_content

def logout_page(request):
    logout(request)
    return redirect('home')


@csrf_exempt
def menu_handler(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        with open("Main_Cafe\static\js\mainMenu.json","r") as file :
            jsonData = json.load(file)
            print(type(jsonData))
            print(jsonData)
            for item in jsonData :
                
                if item["name"] == data[0]:
                    print("before updating" )
                    print(item)
                    item["price"] = int(data[1])
                    print("after updating")
                    print(item)
                    with open ("Main_Cafe\static\js\mainMenu.json","w") as fileWrite :
                        json.dump(jsonData, fileWrite)
                        print("updated sucessfully")

            
    else :
        return JsonResponse({'error': 'Only POST requests are allowed!'}, status=400)
    return HttpResponse(request,'received')



def add_dish(request):
    if request.method == 'POST':
        data = request.POST
        print(data)
        dish_name = data.get("dish_name")
        print(dish_name)
        dish_price = data.get("dish_price")

        if dish_name is None or dish_price is None :
            return redirect('/admindash')

        with open("Main_Cafe\static\js\mainMenu.json","r") as file :
            jsonData = json.load(file)
            newDish = {
                "id" : len(jsonData) + 1 ,
                "name" : dish_name,
                "price" : int(dish_price)
            }
            
            jsonData.append(newDish)
            print("push success")
            print(len(jsonData))

            with open("Main_Cafe\static\js\mainMenu.json" , "w") as fileWriter :
                json.dump(jsonData, fileWriter)
                print("File Written Successfully")

    return redirect("/admindash")

def add_emp(request):
    if request.method == 'POST':
        data = request.POST
        emp_name = data.get("emp_name")
        emp_username = data.get("emp_username")
        emp_password = data.get("emp_password")
        print(emp_name + emp_username + emp_password)

        if emp_name is None or emp_username is None or emp_password is None :
           print("some field is none")
           return redirect("/admindash") 
        else:
            print("using else condition")
            new_emp = User.objects.create_user(emp_username, first_name = emp_name)
            new_emp.set_password(emp_password)
            new_emp.is_staff = True
            new_emp.is_superuser = False
            new_emp.save()
            print("employee created")
    
    return redirect("/admindash")

#code here

@csrf_exempt
def view_emp(request):
    query=User.objects.all()
    queryset=query.exclude(username="admin")
    data=list(queryset.values())
    return JsonResponse(data,safe=False)

@csrf_exempt
def view_bills(request):
    query=RefinedBill.objects.all()
    data=list(query.values())
    for item in data:
        if isinstance(item['total'],Decimal128):
            item['total']=float(str(item['total']))

    return JsonResponse(data,safe=False)

@csrf_exempt
def delete_emp(request):
    if request.method == 'POST':
        data = request.POST
        json_string = next(iter(data.keys()))
        parsed_data = json.loads(json_string)
        username = parsed_data.get('username', [''])[0]
        user=User.objects.filter(username=username)
        if user.exists():
            user.delete()
            reload_script = "window.location.reload(true);"
            context = {
              'reload_script': reload_script
               }
            return render(request,'admin_dashboard.html',context)
        else:
            print("User Not Found")
            return render(request,'admin_dashboard.html')
    else:
        return HttpResponse(request,"the request aint POST")

@csrf_exempt
def delete_bill(request):
    if request.method == 'POST':
        data = request.POST
        json_string = next(iter(data.keys()))
        parsed_data = json.loads(json_string)
        billno = parsed_data.get('bill_no', [''])[0]
        bill=RefinedBill.objects.filter(bill_id=billno)
        if bill.exists():
            bill.delete()
            return confirm(request)
        else:
            print("Bill not found")
    return render(request,'admin_dashboard.html')

@csrf_exempt
def confirm(request):
    data={
        "response":"Ok"
    }
    return JsonResponse(data)